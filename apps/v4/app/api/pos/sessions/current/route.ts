import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/pos/sessions/current?terminal_id=X - Get current open session for a terminal
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const terminalId = searchParams.get("terminal_id");

    if (!terminalId) {
      return NextResponse.json(
        { success: false, error: "terminal_id is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT 
        s.*,
        t.terminal_name,
        t.terminal_code,
        w.name as warehouse_name,
        w.outlet_code,
        CONCAT(u.first_name, ' ', u.last_name) as cashier_name,
        EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - s.opened_at)) / 3600 as hours_open
      FROM pos_sessions s
      JOIN pos_terminals t ON s.terminal_id = t.id
      JOIN warehouses w ON s.warehouse_id = w.id
      JOIN users u ON s.cashier_id = u.id
      WHERE s.terminal_id = $1 AND s.session_status = 'open'
      ORDER BY s.opened_at DESC
      LIMIT 1`,
      [parseInt(terminalId)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "No open session found for this terminal" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching current session:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
