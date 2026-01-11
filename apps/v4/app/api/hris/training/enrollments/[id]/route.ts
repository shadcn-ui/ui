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
        te.*,
        e.first_name,
        e.last_name,
        e.employee_number,
        tp.program_name
       FROM training_enrollments te
       JOIN employees e ON te.employee_id = e.id
       JOIN training_programs tp ON te.program_id = tp.id
       WHERE te.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Training enrollment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching training enrollment:", error);
    return NextResponse.json(
      { error: "Failed to fetch training enrollment" },
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
      `UPDATE training_enrollments 
       SET 
         enrollment_date = COALESCE($1, enrollment_date),
         completion_date = COALESCE($2, completion_date),
         status = COALESCE($3, status),
         score = COALESCE($4, score),
         certificate_issued = COALESCE($5, certificate_issued),
         notes = COALESCE($6, notes),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [
        body.enrollment_date,
        body.completion_date,
        body.status,
        body.score,
        body.certificate_issued,
        body.notes,
        id,
      ]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Training enrollment not found" },
        { status: 404 }
      );
    }

    await client.query("COMMIT");

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating training enrollment:", error);
    return NextResponse.json(
      { error: "Failed to update training enrollment" },
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
      "DELETE FROM training_enrollments WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Training enrollment not found" },
        { status: 404 }
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({ message: "Training enrollment deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting training enrollment:", error);
    return NextResponse.json(
      { error: "Failed to delete training enrollment" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
