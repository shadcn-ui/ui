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
        pr.*,
        e.first_name,
        e.last_name,
        e.employee_number,
        e.department_id,
        d.name as department_name,
        e.position_id,
        p.title as position_title,
        reviewer.first_name as reviewer_first_name,
        reviewer.last_name as reviewer_last_name
       FROM performance_reviews pr
       JOIN employees e ON pr.employee_id = e.id
       LEFT JOIN departments d ON e.department_id = d.id
       LEFT JOIN positions p ON e.position_id = p.id
       LEFT JOIN employees reviewer ON pr.reviewer_id = reviewer.id
       WHERE pr.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Performance review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching performance review:", error);
    return NextResponse.json(
      { error: "Failed to fetch performance review" },
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
      `UPDATE performance_reviews 
       SET 
         review_period = COALESCE($1, review_period),
         review_date = COALESCE($2, review_date),
         rating = COALESCE($3, rating),
         reviewer_id = COALESCE($4, reviewer_id),
         goals_achieved = COALESCE($5, goals_achieved),
         areas_for_improvement = COALESCE($6, areas_for_improvement),
         comments = COALESCE($7, comments),
         status = COALESCE($8, status),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [
        body.review_period,
        body.review_date,
        body.rating,
        body.reviewer_id,
        body.goals_achieved,
        body.areas_for_improvement,
        body.comments,
        body.status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Performance review not found" },
        { status: 404 }
      );
    }

    await client.query("COMMIT");

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating performance review:", error);
    return NextResponse.json(
      { error: "Failed to update performance review" },
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
      "DELETE FROM performance_reviews WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Performance review not found" },
        { status: 404 }
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({ message: "Performance review deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting performance review:", error);
    return NextResponse.json(
      { error: "Failed to delete performance review" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
