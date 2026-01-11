import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/dashboards - List dashboards
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const userId = searchParams.get("user_id");

    let query = `
      SELECT 
        d.*,
        CONCAT(u.first_name, ' ', u.last_name) as created_by_name,
        (
          SELECT COUNT(*) FROM dashboard_widgets WHERE dashboard_id = d.id
        ) as widget_count
      FROM dashboards d
      LEFT JOIN users u ON d.created_by = u.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND d.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    // Filter by user role access
    if (userId) {
      const userRole = await pool.query(
        `SELECT role_id FROM users WHERE id = $1`,
        [userId]
      );
      
      if (userRole.rows.length > 0) {
        query += ` AND ($${paramIndex} = ANY(d.role_ids) OR d.role_ids IS NULL)`;
        params.push(userRole.rows[0].role_id);
        paramIndex++;
      }
    }

    query += ` ORDER BY d.is_default DESC, d.created_at DESC`;

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      dashboards: result.rows,
    });
  } catch (error: any) {
    console.error("Error fetching dashboards:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/dashboards - Create new dashboard
export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const {
      dashboard_code,
      name,
      description,
      category,
      layout_config,
      refresh_interval,
      is_default,
      role_ids,
      created_by,
    } = body;

    // Validation
    if (!dashboard_code || !name || !layout_config) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // If setting as default, unset other defaults in same category
    if (is_default) {
      await client.query(
        `UPDATE dashboards SET is_default = false WHERE category = $1`,
        [category || 'executive']
      );
    }

    const result = await client.query(
      `INSERT INTO dashboards (
        dashboard_code, name, description, category, layout_config,
        refresh_interval, is_default, role_ids, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        dashboard_code,
        name,
        description || null,
        category || 'executive',
        JSON.stringify(layout_config),
        refresh_interval || 300,
        is_default || false,
        role_ids || null,
        created_by,
      ]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      dashboard: result.rows[0],
      message: "Dashboard created successfully",
    }, { status: 201 });

  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error creating dashboard:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
