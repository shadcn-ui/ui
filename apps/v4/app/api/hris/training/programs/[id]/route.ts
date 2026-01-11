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
        tp.*,
        COUNT(DISTINCT te.id) as total_enrollments,
        COUNT(DISTINCT CASE WHEN te.status = 'Completed' THEN te.id END) as completed_enrollments
       FROM training_programs tp
       LEFT JOIN training_enrollments te ON tp.id = te.program_id
       WHERE tp.id = $1
       GROUP BY tp.id`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Training program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching training program:", error);
    return NextResponse.json(
      { error: "Failed to fetch training program" },
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
      `UPDATE training_programs 
       SET 
         program_name = COALESCE($1, program_name),
         description = COALESCE($2, description),
         duration = COALESCE($3, duration),
         capacity = COALESCE($4, capacity),
         start_date = COALESCE($5, start_date),
         end_date = COALESCE($6, end_date),
         trainer_name = COALESCE($7, trainer_name),
         status = COALESCE($8, status),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [
        body.program_name,
        body.description,
        body.duration,
        body.capacity,
        body.start_date,
        body.end_date,
        body.trainer_name,
        body.status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Training program not found" },
        { status: 404 }
      );
    }

    await client.query("COMMIT");

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating training program:", error);
    return NextResponse.json(
      { error: "Failed to update training program" },
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

    // Check if there are enrollments
    const enrollmentCheck = await client.query(
      "SELECT COUNT(*) as count FROM training_enrollments WHERE program_id = $1",
      [id]
    );

    if (parseInt(enrollmentCheck.rows[0].count) > 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        {
          error:
            "Cannot delete training program with existing enrollments. Delete enrollments first or change program status.",
        },
        { status: 400 }
      );
    }

    const result = await client.query(
      "DELETE FROM training_programs WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Training program not found" },
        { status: 404 }
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({ message: "Training program deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting training program:", error);
    return NextResponse.json(
      { error: "Failed to delete training program" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
