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
        pp.*,
        COUNT(DISTINCT pr.id) as total_employees,
        COALESCE(SUM(pr.gross_salary), 0) as total_gross,
        COALESCE(SUM(pr.total_deductions), 0) as total_deductions,
        COALESCE(SUM(pr.net_salary), 0) as total_net
       FROM payroll_periods pp
       LEFT JOIN payroll_records pr ON pp.id = pr.period_id
       WHERE pp.id = $1
       GROUP BY pp.id`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Payroll period not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching payroll period:", error);
    return NextResponse.json(
      { error: "Failed to fetch payroll period" },
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
      `UPDATE payroll_periods 
       SET 
         period_name = COALESCE($1, period_name),
         start_date = COALESCE($2, start_date),
         end_date = COALESCE($3, end_date),
         payment_date = COALESCE($4, payment_date),
         status = COALESCE($5, status),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [
        body.period_name,
        body.start_date,
        body.end_date,
        body.payment_date,
        body.status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Payroll period not found" },
        { status: 404 }
      );
    }

    await client.query("COMMIT");

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating payroll period:", error);
    return NextResponse.json(
      { error: "Failed to update payroll period" },
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

    // Check if there are payroll records
    const recordCheck = await client.query(
      "SELECT COUNT(*) as count FROM payroll_records WHERE period_id = $1",
      [id]
    );

    if (parseInt(recordCheck.rows[0].count) > 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        {
          error:
            "Cannot delete payroll period with existing records. Delete records first or change period status.",
        },
        { status: 400 }
      );
    }

    const result = await client.query(
      "DELETE FROM payroll_periods WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Payroll period not found" },
        { status: 404 }
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({ message: "Payroll period deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting payroll period:", error);
    return NextResponse.json(
      { error: "Failed to delete payroll period" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
