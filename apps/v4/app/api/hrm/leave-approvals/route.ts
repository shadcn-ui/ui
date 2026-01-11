import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/leave-approvals - List pending approvals for manager
// POST /api/hrm/leave-approvals - Approve/reject leave request
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const approver_id = searchParams.get("approver_id");
    const decision = searchParams.get("decision");
    const leave_request_id = searchParams.get("leave_request_id");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    let conditions = [];
    const params: any[] = [];
    let paramCount = 1;

    if (approver_id) {
      conditions.push(`la.approver_id = $${paramCount}`);
      params.push(approver_id);
      paramCount++;
    }

    if (decision) {
      conditions.push(`la.decision = $${paramCount}`);
      params.push(decision);
      paramCount++;
    }

    if (leave_request_id) {
      conditions.push(`la.leave_request_id = $${paramCount}`);
      params.push(leave_request_id);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM hrm_leave_approvals la
      ${whereClause}
    `;
    const countResult = await client.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get approvals with leave request details
    params.push(limit, offset);
    const approvalsQuery = `
      SELECT 
        la.*,
        lr.request_number,
        lr.start_date,
        lr.end_date,
        lr.total_days,
        lr.leave_reason,
        lr.status as request_status,
        lr.submitted_date,
        e.employee_number,
        e.first_name || ' ' || e.last_name as employee_name,
        e.email as employee_email,
        d.department_name,
        lt.leave_type_name,
        lt.leave_type_code,
        lt.is_paid,
        a.first_name || ' ' || a.last_name as approver_name,
        (
          SELECT current_balance 
          FROM hrm_leave_balances 
          WHERE employee_id = lr.employee_id 
            AND leave_type_id = lr.leave_type_id 
            AND leave_year = EXTRACT(YEAR FROM lr.start_date)::INTEGER
        ) as employee_leave_balance
      FROM hrm_leave_approvals la
      LEFT JOIN hrm_leave_requests lr ON la.leave_request_id = lr.leave_request_id
      LEFT JOIN hrm_employees e ON lr.employee_id = e.employee_id
      LEFT JOIN hrm_departments d ON e.department_id = d.department_id
      LEFT JOIN hrm_leave_types lt ON lr.leave_type_id = lt.leave_type_id
      LEFT JOIN hrm_employees a ON la.approver_id = a.employee_id
      ${whereClause}
      ORDER BY lr.submitted_date DESC, la.sequence_order
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    const result = await client.query(approvalsQuery, params);

    // Get summary statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_approvals,
        COUNT(CASE WHEN decision = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN decision = 'approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN decision = 'rejected' THEN 1 END) as rejected_count
      FROM hrm_leave_approvals la
      ${whereClause}
    `;
    const statsResult = await client.query(statsQuery, params.slice(0, -2));

    return NextResponse.json({
      approvals: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statistics: statsResult.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching leave approvals:", error);
    return NextResponse.json(
      { error: "Failed to fetch leave approvals", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const body = await request.json();
    const {
      approval_id,
      leave_request_id,
      approver_id,
      decision,
      comments,
    } = body;

    if (!leave_request_id || !approver_id || !decision) {
      return NextResponse.json(
        { error: "Missing required fields: leave_request_id, approver_id, decision" },
        { status: 400 }
      );
    }

    if (!["approved", "rejected"].includes(decision)) {
      return NextResponse.json(
        { error: "Invalid decision. Must be 'approved' or 'rejected'" },
        { status: 400 }
      );
    }

    // Get approval record
    let approvalQuery;
    let approvalParams;

    if (approval_id) {
      approvalQuery = `
        SELECT * FROM hrm_leave_approvals 
        WHERE approval_id = $1 AND approver_id = $2
      `;
      approvalParams = [approval_id, approver_id];
    } else {
      approvalQuery = `
        SELECT * FROM hrm_leave_approvals 
        WHERE leave_request_id = $1 AND approver_id = $2 AND decision = 'pending'
        ORDER BY sequence_order
        LIMIT 1
      `;
      approvalParams = [leave_request_id, approver_id];
    }

    const approvalResult = await client.query(approvalQuery, approvalParams);

    if (approvalResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Approval record not found or already processed" },
        { status: 404 }
      );
    }

    const approval = approvalResult.rows[0];

    // Check if this is a valid approver for this sequence
    if (approval.sequence_order > 1) {
      const previousQuery = `
        SELECT * FROM hrm_leave_approvals
        WHERE leave_request_id = $1 
          AND sequence_order < $2
          AND decision != 'approved'
      `;
      const previousResult = await client.query(previousQuery, [
        leave_request_id,
        approval.sequence_order,
      ]);

      if (previousResult.rows.length > 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Previous approval level not completed" },
          { status: 400 }
        );
      }
    }

    // Update approval record
    const updateApprovalQuery = `
      UPDATE hrm_leave_approvals
      SET 
        decision = $1,
        decision_date = NOW(),
        comments = $2,
        updated_at = NOW()
      WHERE approval_id = $3
      RETURNING *
    `;

    const approvalUpdateResult = await client.query(updateApprovalQuery, [
      decision,
      comments || null,
      approval.approval_id,
    ]);

    // Update leave request status if this is final approval or rejection
    let requestStatus = "pending";

    if (decision === "rejected") {
      requestStatus = "rejected";
    } else if (approval.is_final_approver) {
      requestStatus = "approved";
    }

    if (requestStatus !== "pending") {
      const updateRequestQuery = `
        UPDATE hrm_leave_requests
        SET status = $1, updated_at = NOW()
        WHERE leave_request_id = $2
      `;
      await client.query(updateRequestQuery, [requestStatus, leave_request_id]);

      // If approved, the trigger will update leave balance automatically
    }

    await client.query("COMMIT");

    return NextResponse.json({
      message: `Leave request ${decision} successfully`,
      approval: approvalUpdateResult.rows[0],
      request_status: requestStatus,
    });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error processing leave approval:", error);
    return NextResponse.json(
      { error: "Failed to process leave approval", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
