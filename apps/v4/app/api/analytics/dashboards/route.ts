import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

/**
 * GET /api/analytics/dashboards
 * List all dashboards
 * 
 * Query parameters:
 * - dashboard_type: Filter by type (executive, financial, sales, operations, etc.)
 * - is_public: Filter by public access (true/false)
 * - is_active: Filter by active status (true/false)
 * - include_widgets: Include widget configurations (true/false)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dashboard_type = searchParams.get('dashboard_type');
    const is_public = searchParams.get('is_public');
    const is_active = searchParams.get('is_active');
    const include_widgets = searchParams.get('include_widgets') === 'true';

    let query = `
      SELECT 
        d.id,
        d.dashboard_code,
        d.dashboard_name,
        d.dashboard_type,
        d.description,
        d.is_default,
        d.is_public,
        d.owner_id,
        d.layout_config,
        d.refresh_interval_seconds,
        d.allowed_roles,
        d.display_order,
        d.is_active,
        d.created_at,
        d.updated_at
    `;

    if (include_widgets) {
      query += `,
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', w.id,
              'widget_code', w.widget_code,
              'widget_name', w.widget_name,
              'widget_type', w.widget_type,
              'data_source_type', w.data_source_type,
              'widget_config', w.widget_config,
              'grid_position_x', w.grid_position_x,
              'grid_position_y', w.grid_position_y,
              'grid_width', w.grid_width,
              'grid_height', w.grid_height,
              'display_order', w.display_order,
              'is_visible', w.is_visible
            ) ORDER BY w.display_order
          )
          FROM dashboard_widgets w
          WHERE w.dashboard_id = d.id AND w.is_visible = true
        ) as widgets
      `;
    }

    query += ' FROM dashboards d WHERE 1=1';

    const params: any[] = [];
    let paramIndex = 1;

    if (dashboard_type) {
      query += ` AND d.dashboard_type = $${paramIndex}`;
      params.push(dashboard_type);
      paramIndex++;
    }

    if (is_public !== null) {
      query += ` AND d.is_public = $${paramIndex}`;
      params.push(is_public === 'true');
      paramIndex++;
    }

    if (is_active !== null) {
      query += ` AND d.is_active = $${paramIndex}`;
      params.push(is_active === 'true');
      paramIndex++;
    }

    query += ' ORDER BY d.display_order, d.dashboard_name';

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      dashboards: result.rows
    });

  } catch (error: any) {
    console.error('Error fetching dashboards:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/dashboards
 * Create a new dashboard
 */
export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const body = await request.json();
    const {
      dashboard_code,
      dashboard_name,
      dashboard_type,
      description,
      is_default = false,
      is_public = false,
      owner_id,
      layout_config = {},
      refresh_interval_seconds = 300,
      allowed_roles = [],
      display_order = 0,
      widgets = []
    } = body;

    // Validate required fields
    if (!dashboard_code || !dashboard_name || !dashboard_type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: dashboard_code, dashboard_name, dashboard_type' },
        { status: 400 }
      );
    }

    // Check for duplicate dashboard_code
    const checkQuery = 'SELECT id FROM dashboards WHERE dashboard_code = $1';
    const checkResult = await client.query(checkQuery, [dashboard_code]);
    
    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Dashboard code already exists' },
        { status: 400 }
      );
    }

    // Create dashboard
    const dashboardQuery = `
      INSERT INTO dashboards (
        dashboard_code, dashboard_name, dashboard_type, description,
        is_default, is_public, owner_id, layout_config,
        refresh_interval_seconds, allowed_roles, display_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const dashboardResult = await client.query(dashboardQuery, [
      dashboard_code, dashboard_name, dashboard_type, description,
      is_default, is_public, owner_id, JSON.stringify(layout_config),
      refresh_interval_seconds, allowed_roles, display_order
    ]);

    const dashboard = dashboardResult.rows[0];

    // Create widgets if provided
    const createdWidgets = [];
    for (const widget of widgets) {
      const widgetQuery = `
        INSERT INTO dashboard_widgets (
          dashboard_id, widget_code, widget_name, widget_type,
          data_source_type, kpi_id, query_sql, api_endpoint, static_data,
          widget_config, filter_config,
          grid_position_x, grid_position_y, grid_width, grid_height,
          display_order, is_visible, requires_drill_down, drill_down_config
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *
      `;

      const widgetResult = await client.query(widgetQuery, [
        dashboard.id,
        widget.widget_code,
        widget.widget_name,
        widget.widget_type,
        widget.data_source_type,
        widget.kpi_id || null,
        widget.query_sql || null,
        widget.api_endpoint || null,
        widget.static_data ? JSON.stringify(widget.static_data) : null,
        JSON.stringify(widget.widget_config || {}),
        widget.filter_config ? JSON.stringify(widget.filter_config) : null,
        widget.grid_position_x || 0,
        widget.grid_position_y || 0,
        widget.grid_width || 4,
        widget.grid_height || 3,
        widget.display_order || 0,
        widget.is_visible !== false,
        widget.requires_drill_down || false,
        widget.drill_down_config ? JSON.stringify(widget.drill_down_config) : null
      ]);

      createdWidgets.push(widgetResult.rows[0]);
    }

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: 'Dashboard created successfully',
      dashboard: {
        ...dashboard,
        widgets: createdWidgets
      }
    }, { status: 201 });

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating dashboard:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
