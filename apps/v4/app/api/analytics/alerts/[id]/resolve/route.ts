import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * PATCH /api/analytics/alerts/[id]/resolve
 * Resolve a KPI alert
 * 
 * Request body:
 * - resolved_by: User ID who resolved the alert
 * - resolution_notes: Notes about the resolution
 */
export async function PATCH(
  request: Request,
  context: RouteContext
) {
  const client = await pool.connect();
  
  try {
    const { id } = await context.params;
    const body = await request.json();
    const {
      resolved_by,
      resolution_notes
    } = body;

    const query = `
      UPDATE kpi_alerts
      SET 
        is_resolved = true,
        resolved_at = CURRENT_TIMESTAMP,
        resolved_by = $1,
        resolution_notes = $2
      WHERE id = $3 AND is_resolved = false
      RETURNING *
    `;

    const result = await client.query(query, [resolved_by, resolution_notes, id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Alert not found or already resolved' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Alert resolved successfully',
      alert: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error resolving alert:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * GET /api/analytics/alerts/[id]
 * Get detailed information about a specific alert
 */
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const query = `
      SELECT 
        ka.*,
        kd.kpi_code,
        kd.kpi_name,
        kd.kpi_category,
        kd.unit_of_measure,
        kd.target_value,
        km.metric_date,
        km.metric_value as current_metric_value,
        km.status as current_metric_status
      FROM kpi_alerts ka
      JOIN kpi_definitions kd ON ka.kpi_id = kd.id
      LEFT JOIN kpi_metrics km ON ka.metric_id = km.id
      WHERE ka.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      alert: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error fetching alert details:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
