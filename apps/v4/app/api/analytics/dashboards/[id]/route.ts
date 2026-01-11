import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/analytics/dashboards/[id]
 * Get detailed dashboard configuration with widgets
 */
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const query = `
      SELECT 
        d.*,
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', w.id,
              'widget_code', w.widget_code,
              'widget_name', w.widget_name,
              'widget_type', w.widget_type,
              'data_source_type', w.data_source_type,
              'kpi_id', w.kpi_id,
              'query_sql', w.query_sql,
              'api_endpoint', w.api_endpoint,
              'static_data', w.static_data,
              'widget_config', w.widget_config,
              'filter_config', w.filter_config,
              'grid_position_x', w.grid_position_x,
              'grid_position_y', w.grid_position_y,
              'grid_width', w.grid_width,
              'grid_height', w.grid_height,
              'display_order', w.display_order,
              'is_visible', w.is_visible,
              'requires_drill_down', w.requires_drill_down,
              'drill_down_config', w.drill_down_config
            ) ORDER BY w.display_order
          )
          FROM dashboard_widgets w
          WHERE w.dashboard_id = d.id
        ) as widgets,
        (
          SELECT COUNT(*) FROM dashboard_access_log
          WHERE dashboard_id = d.id
            AND access_timestamp >= CURRENT_DATE - INTERVAL '30 days'
        ) as views_last_30_days
      FROM dashboards d
      WHERE d.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Dashboard not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      dashboard: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error fetching dashboard:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/analytics/dashboards/[id]
 * Update dashboard configuration
 */
export async function PATCH(
  request: Request,
  context: RouteContext
) {
  const client = await pool.connect();
  
  try {
    const { id } = await context.params;
    const body = await request.json();

    const allowedFields = [
      'dashboard_name', 'description', 'is_default', 'is_public',
      'layout_config', 'refresh_interval_seconds', 'allowed_roles',
      'display_order', 'is_active'
    ];

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(body)) {
      if (allowedFields.includes(key)) {
        if (key === 'layout_config' || key === 'allowed_roles') {
          updates.push(`${key} = $${paramIndex}`);
          values.push(JSON.stringify(value));
        } else {
          updates.push(`${key} = $${paramIndex}`);
          values.push(value);
        }
        paramIndex++;
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE dashboards
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Dashboard not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Dashboard updated successfully',
      dashboard: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error updating dashboard:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * DELETE /api/analytics/dashboards/[id]
 * Delete a dashboard (also deletes all widgets)
 */
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  const client = await pool.connect();
  
  try {
    const { id } = await context.params;

    const query = 'DELETE FROM dashboards WHERE id = $1 RETURNING *';
    const result = await client.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Dashboard not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Dashboard deleted successfully',
      dashboard: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error deleting dashboard:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
