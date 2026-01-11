import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/leave-balances - List leave balances
// POST /api/hrm/leave-balances - Manual adjustment
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const employee_id = searchParams.get("employee_id");
    const leave_type_id = searchParams.get("leave_type_id");
    const leave_year = searchParams.get("leave_year") || new Date().getFullYear().toString();
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    let conditions = [`lb.leave_year = $1`];
    const params: any[] = [parseInt(leave_year)];
    let paramCount = 2;

    if (employee_id) {
      conditions.push(`lb.employee_id = $${paramCount}`);
      params.push(employee_id);
      paramCount++;
    }

    if (leave_type_id) {
      conditions.push(`lb.leave_type_id = $${paramCount}`);
      params.push(leave_type_id);
      paramCount++;
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM hrm_leave_balances lb
      ${whereClause}
    `;
    const countResult = await client.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get leave balances
    params.push(limit, offset);
    const balancesQuery = `
      SELECT 
        lb.*,
        e.employee_number,
        e.first_name || ' ' || e.last_name as employee_name,
        d.department_name,
        lt.leave_type_name,
        lt.leave_type_code,
        lt.is_paid,
        lt.max_carry_forward,
        (
          SELECT COUNT(*) 
          FROM hrm_leave_requests lr
          WHERE lr.employee_id = lb.employee_id 
            AND lr.leave_type_id = lb.leave_type_id
            AND EXTRACT(YEAR FROM lr.start_date)::INTEGER = lb.leave_year
            AND lr.status = 'pending'
        ) as pending_requests_count,
        (
          SELECT SUM(total_days)
          FROM hrm_leave_requests lr
          WHERE lr.employee_id = lb.employee_id 
            AND lr.leave_type_id = lb.leave_type_id
            AND EXTRACT(YEAR FROM lr.start_date)::INTEGER = lb.leave_year
            AND lr.status = 'approved'
        ) as approved_leave_days
      FROM hrm_leave_balances lb
      LEFT JOIN hrm_employees e ON lb.employee_id = e.employee_id
      LEFT JOIN hrm_departments d ON e.department_id = d.department_id
      LEFT JOIN hrm_leave_types lt ON lb.leave_type_id = lt.leave_type_id
      ${whereClause}
      ORDER BY e.employee_number, lt.leave_type_name
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    const result = await client.query(balancesQuery, params);

    // Get summary statistics
    const statsQuery = `
      SELECT 
        SUM(opening_balance) as total_opening_balance,
        SUM(accrued) as total_accrued,
        SUM(used) as total_used,
        SUM(pending) as total_pending,
        SUM(current_balance) as total_current_balance,
        AVG(current_balance) as avg_current_balance
      FROM hrm_leave_balances lb
      ${whereClause}
    `;
    const statsResult = await client.query(statsQuery, params.slice(0, -2));

    return NextResponse.json({
      leave_balances: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statistics: statsResult.rows[0],
      year: parseInt(leave_year),
    });
  } catch (error: any) {
    console.error("Error fetching leave balances:", error);
    return NextResponse.json(
      { error: "Failed to fetch leave balances", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const {
      employee_id,
      leave_type_id,
      leave_year,
      adjustment_type,
      adjustment_amount,
      reason,
      adjusted_by,
    } = body;

    if (!employee_id || !leave_type_id || !leave_year || !adjustment_type || !adjustment_amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get current balance
    const balanceQuery = `
      SELECT * FROM hrm_leave_balances
      WHERE employee_id = $1 AND leave_type_id = $2 AND leave_year = $3
    `;
    const balanceResult = await client.query(balanceQuery, [
      employee_id,
      leave_type_id,
      leave_year,
    ]);

    if (balanceResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Leave balance not found" },
        { status: 404 }
      );
    }

    const currentBalance = balanceResult.rows[0];

    // Calculate new values based on adjustment type
    let updates: any = { adjustment: currentBalance.adjustment };
    let newCurrentBalance = currentBalance.current_balance;

    if (adjustment_type === "add") {
      updates.adjustment = currentBalance.adjustment + adjustment_amount;
      updates.accrued = currentBalance.accrued + adjustment_amount;
      newCurrentBalance = currentBalance.current_balance + adjustment_amount;
    } else if (adjustment_type === "deduct") {
      updates.adjustment = currentBalance.adjustment - adjustment_amount;
      updates.used = currentBalance.used + adjustment_amount;
      newCurrentBalance = currentBalance.current_balance - adjustment_amount;
    } else if (adjustment_type === "set") {
      const difference = adjustment_amount - currentBalance.current_balance;
      updates.adjustment = currentBalance.adjustment + difference;
      newCurrentBalance = adjustment_amount;
    } else {
      return NextResponse.json(
        { error: "Invalid adjustment_type. Must be 'add', 'deduct', or 'set'" },
        { status: 400 }
      );
    }

    // Update balance
    const updateQuery = `
      UPDATE hrm_leave_balances
      SET 
        adjustment = $1,
        ${updates.accrued !== undefined ? "accrued = $2," : ""}
        ${updates.used !== undefined ? "used = $" + (updates.accrued !== undefined ? "3" : "2") + "," : ""}
        current_balance = current_balance + $${updates.accrued !== undefined ? (updates.used !== undefined ? "4" : "3") : (updates.used !== undefined ? "3" : "2")},
        balance_as_of_date = NOW(),
        updated_at = NOW()
      WHERE employee_id = $${updates.accrued !== undefined ? (updates.used !== undefined ? "5" : "4") : (updates.used !== undefined ? "4" : "3")}
        AND leave_type_id = $${updates.accrued !== undefined ? (updates.used !== undefined ? "6" : "5") : (updates.used !== undefined ? "5" : "4")}
        AND leave_year = $${updates.accrued !== undefined ? (updates.used !== undefined ? "7" : "6") : (updates.used !== undefined ? "6" : "5")}
      RETURNING *
    `;

    const updateParams: any[] = [updates.adjustment];
    if (updates.accrued !== undefined) updateParams.push(updates.accrued);
    if (updates.used !== undefined) updateParams.push(updates.used);
    
    const difference = newCurrentBalance - currentBalance.current_balance;
    updateParams.push(difference, employee_id, leave_type_id, leave_year);

    const result = await client.query(updateQuery, updateParams);

    // Log adjustment (optional - could create an adjustment history table)
    // For now, just return success

    return NextResponse.json({
      message: "Leave balance adjusted successfully",
      leave_balance: result.rows[0],
      adjustment: {
        type: adjustment_type,
        amount: adjustment_amount,
        previous_balance: currentBalance.current_balance,
        new_balance: result.rows[0].current_balance,
        reason,
        adjusted_by,
      },
    });
  } catch (error: any) {
    console.error("Error adjusting leave balance:", error);
    return NextResponse.json(
      { error: "Failed to adjust leave balance", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
