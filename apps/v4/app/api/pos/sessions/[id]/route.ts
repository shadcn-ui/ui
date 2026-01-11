import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/pos/sessions/[id] - Get specific session details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = parseInt(params.id);

    const result = await pool.query(
      `SELECT 
        s.*,
        t.terminal_name,
        t.terminal_code,
        w.name as warehouse_name,
        w.outlet_code,
        CONCAT(u.first_name, ' ', u.last_name) as cashier_name,
        EXTRACT(EPOCH FROM (COALESCE(s.closed_at, CURRENT_TIMESTAMP) - s.opened_at)) / 3600 as session_duration_hours
      FROM pos_sessions s
      JOIN pos_terminals t ON s.terminal_id = t.id
      JOIN warehouses w ON s.warehouse_id = w.id
      JOIN users u ON s.cashier_id = u.id
      WHERE s.id = $1`,
      [sessionId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    // Get transaction summary for this session
    const transactionSummary = await pool.query(
      `SELECT 
        COUNT(*) as transaction_count,
        COALESCE(SUM(total_amount), 0) as total_sales,
        COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END), 0) as paid_sales,
        COALESCE(SUM(CASE WHEN payment_status = 'refunded' THEN total_amount ELSE 0 END), 0) as refunded_sales
      FROM pos_transactions
      WHERE session_id = $1`,
      [sessionId]
    );

    // Get cash movements for this session
    const cashMovements = await pool.query(
      `SELECT 
        cm.*,
        CONCAT(u.first_name, ' ', u.last_name) as performed_by_name
      FROM pos_cash_movements cm
      JOIN users u ON cm.performed_by = u.id
      WHERE cm.session_id = $1
      ORDER BY cm.created_at DESC`,
      [sessionId]
    );

    return NextResponse.json({
      success: true,
      data: {
        session: result.rows[0],
        summary: transactionSummary.rows[0],
        cash_movements: cashMovements.rows,
      },
    });
  } catch (error: any) {
    console.error("Error fetching session details:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/pos/sessions/[id]/close - Close a session
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const sessionId = parseInt(params.id);
    const body = await request.json();
    const { closing_cash, notes } = body;

    await client.query("BEGIN");

    // Get session details
    const sessionResult = await client.query(
      `SELECT * FROM pos_sessions WHERE id = $1`,
      [sessionId]
    );

    if (sessionResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    const session = sessionResult.rows[0];

    if (session.session_status === 'closed') {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { success: false, error: "Session is already closed" },
        { status: 400 }
      );
    }

    // Calculate expected cash
    const cashSalesResult = await client.query(
      `SELECT COALESCE(SUM(pp.amount), 0) as total_cash
       FROM pos_transactions pt
       JOIN pos_payments pp ON pt.id = pp.pos_transaction_id
       WHERE pt.session_id = $1 
       AND pp.payment_method = 'cash'
       AND pt.payment_status = 'paid'`,
      [sessionId]
    );

    const totalCashSales = parseFloat(cashSalesResult.rows[0].total_cash);
    
    // Get cash movements (cash in - cash out)
    const cashMovementsResult = await client.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN movement_type = 'in' THEN amount ELSE 0 END), 0) as cash_in,
        COALESCE(SUM(CASE WHEN movement_type = 'out' THEN amount ELSE 0 END), 0) as cash_out
       FROM pos_cash_movements
       WHERE session_id = $1`,
      [sessionId]
    );

    const cashIn = parseFloat(cashMovementsResult.rows[0].cash_in);
    const cashOut = parseFloat(cashMovementsResult.rows[0].cash_out);

    const expectedCash = session.opening_cash + totalCashSales + cashIn - cashOut;
    const cashVariance = closing_cash - expectedCash;

    // Get transaction counts and totals
    const summaryResult = await client.query(
      `SELECT 
        COUNT(*) as transaction_count,
        COALESCE(SUM(total_amount), 0) as total_sales,
        COALESCE(SUM(CASE WHEN transaction_type = 'refund' THEN total_amount ELSE 0 END), 0) as total_refunds
       FROM pos_transactions
       WHERE session_id = $1`,
      [sessionId]
    );

    const summary = summaryResult.rows[0];

    // Close the session
    const updateResult = await client.query(
      `UPDATE pos_sessions SET
        closed_at = CURRENT_TIMESTAMP,
        closing_cash = $1,
        expected_cash = $2,
        cash_variance = $3,
        total_transactions = $4,
        total_sales = $5,
        total_refunds = $6,
        session_status = 'closed',
        notes = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *`,
      [
        closing_cash,
        expectedCash,
        cashVariance,
        summary.transaction_count,
        summary.total_sales,
        summary.total_refunds,
        notes,
        sessionId,
      ]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      data: updateResult.rows[0],
      message: "Session closed successfully",
    });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error closing session:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
