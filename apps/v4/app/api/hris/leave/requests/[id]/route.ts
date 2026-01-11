import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const { id } = params;

    const result = await client.query(
      `SELECT 
        lr.*,
        e.first_name,
        e.last_name,
        e.employee_number,
        lt.name as leave_type_name,
        approver.first_name as approver_first_name,
        approver.last_name as approver_last_name
       FROM leave_requests lr
       JOIN employees e ON lr.employee_id = e.id
       JOIN leave_types lt ON lr.leave_type_id = lt.id
       LEFT JOIN employees approver ON lr.approver_id = approver.id
       WHERE lr.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Leave request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching leave request:", error);
    return NextResponse.json(
      { error: "Failed to fetch leave request" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const { id } = params;
    const body = await request.json();

    await client.query("BEGIN");

    const result = await client.query(
      `UPDATE leave_requests 
       SET 
         start_date = COALESCE($1, start_date),
         end_date = COALESCE($2, end_date),
         days_requested = COALESCE($3, days_requested),
         reason = COALESCE($4, reason),
         status = COALESCE($5, status),
         approver_id = COALESCE($6, approver_id),
         approver_notes = COALESCE($7, approver_notes),
         approved_date = COALESCE($8, approved_date),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [
        body.start_date,
        body.end_date,
        body.days_requested,
        body.reason,
        body.status,
        body.approver_id,
        body.approver_notes,
        body.approved_date,
        id,
      ]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Leave request not found" },
        { status: 404 }
      );
    }

    await client.query("COMMIT");

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating leave request:", error);
    return NextResponse.json(
      { error: "Failed to update leave request" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const { id } = params;

    await client.query("BEGIN");

    const result = await client.query(
      "DELETE FROM leave_requests WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Leave request not found" },
        { status: 404 }
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({ message: "Leave request cancelled successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error cancelling leave request:", error);
    return NextResponse.json(
      { error: "Failed to cancel leave request" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
