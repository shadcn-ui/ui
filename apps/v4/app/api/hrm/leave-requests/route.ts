import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/leave-requests - List leave requests
// POST /api/hrm/leave-requests - Submit leave request
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const employee_id = searchParams.get("employee_id");
    const leave_type_id = searchParams.get("leave_type_id");
    const status = searchParams.get("status");
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    let conditions = [];
    const params: any[] = [];
    let paramCount = 1;

    if (employee_id) {
      conditions.push(`lr.employee_id = $${paramCount}`);
      params.push(employee_id);
      paramCount++;
    }

    if (leave_type_id) {
      conditions.push(`lr.leave_type_id = $${paramCount}`);
      params.push(leave_type_id);
      paramCount++;
    }

    if (status) {
      conditions.push(`lr.status = $${paramCount}`);
      params.push(status);
      paramCount++;
    }

    if (start_date) {
      conditions.push(`lr.start_date >= $${paramCount}`);
      params.push(start_date);
      paramCount++;
    }

    if (end_date) {
      conditions.push(`lr.end_date <= $${paramCount}`);
      params.push(end_date);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM hrm_leave_requests lr
      ${whereClause}
    `;
    const countResult = await client.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get leave requests
    params.push(limit, offset);
    const requestsQuery = `
      SELECT 
        lr.*,
        e.employee_number,
        e.first_name || ' ' || e.last_name as employee_name,
        d.department_name,
        lt.leave_type_name,
        lt.leave_type_code,
        lt.is_paid,
        ce.first_name || ' ' || ce.last_name as covering_employee_name,
        (
          SELECT json_agg(
            json_build_object(
              'approval_id', la.approval_id,
              'approver_id', la.approver_id,
              'approver_name', ae.first_name || ' ' || ae.last_name,
              'approval_level', la.approval_level,
              'decision', la.decision,
              'decision_date', la.decision_date,
              'comments', la.comments,
              'sequence_order', la.sequence_order,
              'is_final_approver', la.is_final_approver
            ) ORDER BY la.sequence_order
          )
          FROM hrm_leave_approvals la
          LEFT JOIN hrm_employees ae ON la.approver_id = ae.employee_id
          WHERE la.leave_request_id = lr.leave_request_id
        ) as approvals
      FROM hrm_leave_requests lr
      LEFT JOIN hrm_employees e ON lr.employee_id = e.employee_id
      LEFT JOIN hrm_departments d ON e.department_id = d.department_id
      LEFT JOIN hrm_leave_types lt ON lr.leave_type_id = lt.leave_type_id
      LEFT JOIN hrm_employees ce ON lr.covering_employee_id = ce.employee_id
      ${whereClause}
      ORDER BY lr.submitted_date DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    const result = await client.query(requestsQuery, params);

    // Get summary statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_requests,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count,
        SUM(total_days) as total_days_requested,
        SUM(CASE WHEN status = 'approved' THEN total_days ELSE 0 END) as total_days_approved
      FROM hrm_leave_requests lr
      ${whereClause}
    `;
    const statsResult = await client.query(statsQuery, params.slice(0, -2));

    return NextResponse.json({
      leave_requests: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statistics: statsResult.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching leave requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch leave requests", details: error.message },
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
      employee_id,
      leave_type_id,
      start_date,
      end_date,
      total_days,
      leave_reason,
      emergency_contact,
      emergency_phone,
      covering_employee_id,
      handover_notes,
      has_documentation,
      document_url,
    } = body;

    if (!employee_id || !leave_type_id || !start_date || !end_date || !total_days) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check leave balance
    const balanceQuery = `
      SELECT * FROM hrm_leave_balances
      WHERE employee_id = $1 AND leave_type_id = $2 AND leave_year = $3
    `;
    const currentYear = new Date(start_date).getFullYear();
    const balanceResult = await client.query(balanceQuery, [
      employee_id,
      leave_type_id,
      currentYear,
    ]);

    if (balanceResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "No leave balance found for this leave type" },
        { status: 400 }
      );
    }

    const balance = balanceResult.rows[0];
    if (balance.current_balance < total_days) {
      // Check if leave type allows negative balance
      const leaveTypeQuery = `
        SELECT allow_negative_balance FROM hrm_leave_types WHERE leave_type_id = $1
      `;
      const leaveTypeResult = await client.query(leaveTypeQuery, [leave_type_id]);
      if (!leaveTypeResult.rows[0]?.allow_negative_balance) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          {
            error: "Insufficient leave balance",
            available: balance.current_balance,
            requested: total_days,
          },
          { status: 400 }
        );
      }
    }

    // Generate request number
    const sequenceQuery = `
      SELECT COALESCE(MAX(CAST(SUBSTRING(request_number FROM '[0-9]+') AS INTEGER)), 0) + 1 as next_num
      FROM hrm_leave_requests
      WHERE request_number ~ '^LR[0-9]{6}$'
    `;
    const sequenceResult = await client.query(sequenceQuery);
    const request_number = `LR${String(sequenceResult.rows[0].next_num).padStart(6, "0")}`;

    // Insert leave request
    const insertQuery = `
      INSERT INTO hrm_leave_requests (
        request_number, employee_id, leave_type_id,
        start_date, end_date, total_days, leave_reason,
        emergency_contact, emergency_phone,
        covering_employee_id, handover_notes,
        has_documentation, document_url,
        submitted_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      request_number,
      employee_id,
      leave_type_id,
      start_date,
      end_date,
      total_days,
      leave_reason || null,
      emergency_contact || null,
      emergency_phone || null,
      covering_employee_id || null,
      handover_notes || null,
      has_documentation || false,
      document_url || null,
    ]);

    const leave_request_id = result.rows[0].leave_request_id;

    // Create approval workflow (get manager)
    const managerQuery = `
      SELECT manager_id FROM hrm_employees WHERE employee_id = $1
    `;
    const managerResult = await client.query(managerQuery, [employee_id]);

    if (managerResult.rows[0]?.manager_id) {
      await client.query(
        `
        INSERT INTO hrm_leave_approvals (
          leave_request_id, approver_id, approval_level, sequence_order, is_final_approver
        ) VALUES ($1, $2, 1, 1, true)
      `,
        [leave_request_id, managerResult.rows[0].manager_id]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      message: "Leave request submitted successfully",
      leave_request: result.rows[0],
    }, { status: 201 });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error submitting leave request:", error);
    return NextResponse.json(
      { error: "Failed to submit leave request", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
