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
        pp.period_name,
        pp.payment_date
       FROM payroll_records pr
       JOIN employees e ON pr.employee_id = e.id
       JOIN payroll_periods pp ON pr.period_id = pp.id
       WHERE pr.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Payroll record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching payroll record:", error);
    return NextResponse.json(
      { error: "Failed to fetch payroll record" },
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

    // Calculate derived fields
    const basic_salary = body.basic_salary || 0;
    const allowances = body.allowances || 0;
    const overtime_pay = body.overtime_pay || 0;
    const deductions = body.deductions || 0;
    const tax = body.tax || 0;

    const gross_salary = basic_salary + allowances + overtime_pay;
    const total_deductions = deductions + tax;
    const net_salary = gross_salary - total_deductions;

    const result = await client.query(
      `UPDATE payroll_records 
       SET 
         basic_salary = COALESCE($1, basic_salary),
         allowances = COALESCE($2, allowances),
         overtime_pay = COALESCE($3, overtime_pay),
         deductions = COALESCE($4, deductions),
         tax = COALESCE($5, tax),
         gross_salary = $6,
         total_deductions = $7,
         net_salary = $8,
         notes = COALESCE($9, notes),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [
        basic_salary,
        allowances,
        overtime_pay,
        deductions,
        tax,
        gross_salary,
        total_deductions,
        net_salary,
        body.notes,
        id,
      ]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Payroll record not found" },
        { status: 404 }
      );
    }

    await client.query("COMMIT");

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating payroll record:", error);
    return NextResponse.json(
      { error: "Failed to update payroll record" },
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
      "DELETE FROM payroll_records WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Payroll record not found" },
        { status: 404 }
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({ message: "Payroll record deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting payroll record:", error);
    return NextResponse.json(
      { error: "Failed to delete payroll record" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
