import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/leave-requests/[id] - Get specific leave request
// PUT /api/hrm/leave-requests/[id] - Update leave request (withdraw/modify)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const { id } = params;

    const query = `
      SELECT 
        lr.*,
        e.employee_number,
        e.first_name || ' ' || e.last_name as employee_name,
        e.email as employee_email,
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
              'approver_email', ae.email,
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
        ) as approvals,
        (
          SELECT current_balance 
          FROM hrm_leave_balances 
          WHERE employee_id = lr.employee_id 
            AND leave_type_id = lr.leave_type_id 
            AND leave_year = EXTRACT(YEAR FROM lr.start_date)::INTEGER
        ) as current_leave_balance
      FROM hrm_leave_requests lr
      LEFT JOIN hrm_employees e ON lr.employee_id = e.employee_id
      LEFT JOIN hrm_departments d ON e.department_id = d.department_id
      LEFT JOIN hrm_leave_types lt ON lr.leave_type_id = lt.leave_type_id
      LEFT JOIN hrm_employees ce ON lr.covering_employee_id = ce.employee_id
      WHERE lr.leave_request_id = $1
    `;

    const result = await client.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Leave request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ leave_request: result.rows[0] });
  } catch (error: any) {
    console.error("Error fetching leave request:", error);
    return NextResponse.json(
      { error: "Failed to fetch leave request", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const { id } = params;
    const body = await request.json();
    const { action } = body; // 'withdraw', 'cancel', or 'update'

    // Get current request
    const currentQuery = `
      SELECT * FROM hrm_leave_requests WHERE leave_request_id = $1
    `;
    const currentResult = await client.query(currentQuery, [id]);

    if (currentResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Leave request not found" },
        { status: 404 }
      );
    }

    const currentRequest = currentResult.rows[0];

    if (action === "withdraw" || action === "cancel") {
      if (currentRequest.status !== "pending") {
        return NextResponse.json(
          { error: "Can only withdraw/cancel pending requests" },
          { status: 400 }
        );
      }

      const updateQuery = `
        UPDATE hrm_leave_requests
        SET status = $1, updated_at = NOW()
        WHERE leave_request_id = $2
        RETURNING *
      `;

      const result = await client.query(updateQuery, [
        action === "withdraw" ? "withdrawn" : "cancelled",
        id,
      ]);

      return NextResponse.json({
        message: `Leave request ${action}ed successfully`,
        leave_request: result.rows[0],
      });

    } else if (action === "approve" || action === "reject") {
      // This is handled by the approvals API
      return NextResponse.json(
        { error: "Use /api/hrm/leave-approvals to approve/reject requests" },
        { status: 400 }
      );

    } else if (action === "update") {
      if (currentRequest.status !== "pending") {
        return NextResponse.json(
          { error: "Can only update pending requests" },
          { status: 400 }
        );
      }

      const updates = [];
      const values = [];
      let paramCount = 1;

      if (body.start_date !== undefined) {
        updates.push(`start_date = $${paramCount}`);
        values.push(body.start_date);
        paramCount++;
      }

      if (body.end_date !== undefined) {
        updates.push(`end_date = $${paramCount}`);
        values.push(body.end_date);
        paramCount++;
      }

      if (body.total_days !== undefined) {
        updates.push(`total_days = $${paramCount}`);
        values.push(body.total_days);
        paramCount++;
      }

      if (body.leave_reason !== undefined) {
        updates.push(`leave_reason = $${paramCount}`);
        values.push(body.leave_reason);
        paramCount++;
      }

      if (body.covering_employee_id !== undefined) {
        updates.push(`covering_employee_id = $${paramCount}`);
        values.push(body.covering_employee_id);
        paramCount++;
      }

      if (body.handover_notes !== undefined) {
        updates.push(`handover_notes = $${paramCount}`);
        values.push(body.handover_notes);
        paramCount++;
      }

      if (updates.length === 0) {
        return NextResponse.json(
          { error: "No fields to update" },
          { status: 400 }
        );
      }

      updates.push(`updated_at = NOW()`);
      values.push(id);

      const updateQuery = `
        UPDATE hrm_leave_requests
        SET ${updates.join(", ")}
        WHERE leave_request_id = $${paramCount}
        RETURNING *
      `;

      const result = await client.query(updateQuery, values);

      return NextResponse.json({
        message: "Leave request updated successfully",
        leave_request: result.rows[0],
      });

    } else {
      return NextResponse.json(
        { error: "Invalid action. Must be 'withdraw', 'cancel', or 'update'" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error updating leave request:", error);
    return NextResponse.json(
      { error: "Failed to update leave request", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
