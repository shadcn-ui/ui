import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/analytics/kpis/[id]
 * Get detailed information about a specific KPI including recent metrics
 */
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const query = `
      SELECT 
        kd.*,
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', km.id,
              'metric_date', km.metric_date,
              'metric_value', km.metric_value,
              'target_value', km.target_value,
              'variance', km.variance,
              'variance_percent', km.variance_percent,
              'status', km.status,
              'calculated_at', km.calculated_at
            ) ORDER BY km.metric_date DESC
          )
          FROM (
            SELECT * FROM kpi_metrics
            WHERE kpi_id = kd.id
            ORDER BY metric_date DESC
            LIMIT 30
          ) km
        ) as recent_metrics,
        (
          SELECT COUNT(*) FROM kpi_alerts
          WHERE kpi_id = kd.id AND is_resolved = false
        ) as active_alerts,
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', ka.id,
              'alert_type', ka.alert_type,
              'severity', ka.severity,
              'alert_message', ka.alert_message,
              'alert_date', ka.alert_date,
              'metric_value', ka.metric_value,
              'created_at', ka.created_at
            ) ORDER BY ka.created_at DESC
          )
          FROM (
            SELECT * FROM kpi_alerts
            WHERE kpi_id = kd.id AND is_resolved = false
            ORDER BY created_at DESC
            LIMIT 10
          ) ka
        ) as recent_alerts
      FROM kpi_definitions kd
      WHERE kd.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'KPI not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      kpi: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error fetching KPI details:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/analytics/kpis/[id]
 * Update a KPI definition
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
      'kpi_name', 'description', 'calculation_method', 'data_source',
      'unit_of_measure', 'target_value', 'target_operator',
      'green_threshold', 'yellow_threshold', 'red_threshold',
      'aggregation_level', 'refresh_frequency_minutes',
      'is_active', 'owner_id', 'notes'
    ];

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(body)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${paramIndex}`);
        values.push(value);
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
      UPDATE kpi_definitions
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'KPI not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'KPI updated successfully',
      kpi: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error updating KPI:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * DELETE /api/analytics/kpis/[id]
 * Delete a KPI definition (also deletes all related metrics and alerts)
 */
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  const client = await pool.connect();
  
  try {
    const { id } = await context.params;

    const query = 'DELETE FROM kpi_definitions WHERE id = $1 RETURNING *';
    const result = await client.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'KPI not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'KPI deleted successfully',
      kpi: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error deleting KPI:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
