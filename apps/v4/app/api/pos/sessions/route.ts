import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/pos/sessions - Get all sessions or current session for a terminal
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const terminalId = searchParams.get("terminal_id");
    const status = searchParams.get("status");
    const warehouseId = searchParams.get("warehouse_id");

    let query = `
      SELECT 
        s.*,
        t.terminal_name,
        t.terminal_code,
        w.name as warehouse_name,
        w.outlet_code,
        CONCAT(u.first_name, ' ', u.last_name) as cashier_name
      FROM pos_sessions s
      JOIN pos_terminals t ON s.terminal_id = t.id
      JOIN warehouses w ON s.warehouse_id = w.id
      JOIN users u ON s.cashier_id = u.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    if (terminalId) {
      query += ` AND s.terminal_id = $${paramIndex}`;
      params.push(parseInt(terminalId));
      paramIndex++;
    }

    if (status) {
      query += ` AND s.session_status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (warehouseId) {
      query += ` AND s.warehouse_id = $${paramIndex}`;
      params.push(parseInt(warehouseId));
      paramIndex++;
    }

    query += ` ORDER BY s.opened_at DESC`;

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error: any) {
    console.error("Error fetching POS sessions:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/pos/sessions - Open a new session
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    const { terminal_id, warehouse_id, cashier_id, opening_cash } = body;

    // Validation
    if (!terminal_id || !warehouse_id || !cashier_id) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: terminal_id, warehouse_id, cashier_id" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // Check if terminal already has an open session
    const existingSession = await client.query(
      `SELECT id, session_number FROM pos_sessions 
       WHERE terminal_id = $1 AND session_status = 'open'`,
      [terminal_id]
    );

    if (existingSession.rows.length > 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { 
          success: false, 
          error: "Terminal already has an open session",
          session: existingSession.rows[0]
        },
        { status: 400 }
      );
    }

    // Generate session number (format: SES-YYYYMMDD-XXXXX)
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const countResult = await client.query(
      `SELECT COUNT(*) as count FROM pos_sessions 
       WHERE session_number LIKE $1`,
      [`SES-${today}%`]
    );
    const sessionCount = parseInt(countResult.rows[0].count) + 1;
    const sessionNumber = `SES-${today}-${String(sessionCount).padStart(5, '0')}`;

    // Create new session
    const result = await client.query(
      `INSERT INTO pos_sessions (
        session_number, terminal_id, warehouse_id, cashier_id, 
        opening_cash, session_status, opened_at
      ) VALUES ($1, $2, $3, $4, $5, 'open', CURRENT_TIMESTAMP)
      RETURNING *`,
      [sessionNumber, terminal_id, warehouse_id, cashier_id, opening_cash || 0]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: "Session opened successfully",
    }, { status: 201 });

  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error opening POS session:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
