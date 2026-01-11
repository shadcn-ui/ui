import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// PUT /api/hrm/overtime/[id] - Update overtime (approve/reject/pay)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const { id } = params;
    const body = await request.json();
    const { action, approved_by, approved_hours, rejection_reason, payment_amount } = body;

    // Get current overtime record
    const currentQuery = `
      SELECT * FROM hrm_overtime_records WHERE overtime_id = $1
    `;
    const currentResult = await client.query(currentQuery, [id]);

    if (currentResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Overtime record not found" },
        { status: 404 }
      );
    }

    const currentRecord = currentResult.rows[0];

    if (action === "approve") {
      if (currentRecord.status !== "pending") {
        return NextResponse.json(
          { error: "Can only approve pending overtime requests" },
          { status: 400 }
        );
      }

      const updateQuery = `
        UPDATE hrm_overtime_records
        SET 
          status = 'approved',
          approved_by = $1,
          approved_hours = $2,
          approved_date = NOW(),
          updated_at = NOW()
        WHERE overtime_id = $3
        RETURNING *
      `;

      const result = await client.query(updateQuery, [
        approved_by,
        approved_hours || currentRecord.total_hours,
        id,
      ]);

      return NextResponse.json({
        message: "Overtime approved successfully",
        overtime_record: result.rows[0],
      });

    } else if (action === "reject") {
      if (currentRecord.status !== "pending") {
        return NextResponse.json(
          { error: "Can only reject pending overtime requests" },
          { status: 400 }
        );
      }

      const updateQuery = `
        UPDATE hrm_overtime_records
        SET 
          status = 'rejected',
          approved_by = $1,
          notes = $2,
          updated_at = NOW()
        WHERE overtime_id = $3
        RETURNING *
      `;

      const result = await client.query(updateQuery, [
        approved_by,
        rejection_reason || null,
        id,
      ]);

      return NextResponse.json({
        message: "Overtime rejected successfully",
        overtime_record: result.rows[0],
      });

    } else if (action === "pay") {
      if (currentRecord.status !== "approved") {
        return NextResponse.json(
          { error: "Can only pay approved overtime" },
          { status: 400 }
        );
      }

      if (currentRecord.is_paid) {
        return NextResponse.json(
          { error: "Overtime already paid" },
          { status: 400 }
        );
      }

      const updateQuery = `
        UPDATE hrm_overtime_records
        SET 
          status = 'paid',
          is_paid = true,
          payment_date = NOW(),
          payment_amount = $1,
          updated_at = NOW()
        WHERE overtime_id = $2
        RETURNING *
      `;

      const result = await client.query(updateQuery, [
        payment_amount || (currentRecord.approved_hours * currentRecord.pay_multiplier * 50), // Assuming $50/hr base rate
        id,
      ]);

      return NextResponse.json({
        message: "Overtime payment recorded successfully",
        overtime_record: result.rows[0],
      });

    } else {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve', 'reject', or 'pay'" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error updating overtime:", error);
    return NextResponse.json(
      { error: "Failed to update overtime", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
