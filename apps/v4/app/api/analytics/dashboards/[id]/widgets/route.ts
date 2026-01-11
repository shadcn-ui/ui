import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/analytics/dashboards/[id]/widgets
 * Get all widgets for a dashboard
 */
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const query = `
      SELECT 
        w.*,
        CASE 
          WHEN w.kpi_id IS NOT NULL THEN
            (SELECT kpi_name FROM kpi_definitions WHERE id = w.kpi_id)
          ELSE NULL
        END as kpi_name
      FROM dashboard_widgets w
      WHERE w.dashboard_id = $1
      ORDER BY w.display_order
    `;

    const result = await pool.query(query, [id]);

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      widgets: result.rows
    });

  } catch (error: any) {
    console.error('Error fetching widgets:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/dashboards/[id]/widgets
 * Add a new widget to a dashboard
 */
export async function POST(
  request: Request,
  context: RouteContext
) {
  const client = await pool.connect();
  
  try {
    const { id } = await context.params;
    const body = await request.json();
    const {
      widget_code,
      widget_name,
      widget_type,
      data_source_type,
      kpi_id,
      query_sql,
      api_endpoint,
      static_data,
      widget_config = {},
      filter_config,
      grid_position_x = 0,
      grid_position_y = 0,
      grid_width = 4,
      grid_height = 3,
      display_order = 0,
      is_visible = true,
      requires_drill_down = false,
      drill_down_config
    } = body;

    // Validate required fields
    if (!widget_code || !widget_name || !widget_type || !data_source_type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: widget_code, widget_name, widget_type, data_source_type' },
        { status: 400 }
      );
    }

    // Check if dashboard exists
    const dashboardCheck = await client.query('SELECT id FROM dashboards WHERE id = $1', [id]);
    if (dashboardCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Dashboard not found' },
        { status: 404 }
      );
    }

    // Check for duplicate widget_code in this dashboard
    const checkQuery = 'SELECT id FROM dashboard_widgets WHERE dashboard_id = $1 AND widget_code = $2';
    const checkResult = await client.query(checkQuery, [id, widget_code]);
    
    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Widget code already exists in this dashboard' },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO dashboard_widgets (
        dashboard_id, widget_code, widget_name, widget_type,
        data_source_type, kpi_id, query_sql, api_endpoint, static_data,
        widget_config, filter_config,
        grid_position_x, grid_position_y, grid_width, grid_height,
        display_order, is_visible, requires_drill_down, drill_down_config
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      id,
      widget_code,
      widget_name,
      widget_type,
      data_source_type,
      kpi_id || null,
      query_sql || null,
      api_endpoint || null,
      static_data ? JSON.stringify(static_data) : null,
      JSON.stringify(widget_config),
      filter_config ? JSON.stringify(filter_config) : null,
      grid_position_x,
      grid_position_y,
      grid_width,
      grid_height,
      display_order,
      is_visible,
      requires_drill_down,
      drill_down_config ? JSON.stringify(drill_down_config) : null
    ]);

    return NextResponse.json({
      success: true,
      message: 'Widget added successfully',
      widget: result.rows[0]
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error adding widget:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
