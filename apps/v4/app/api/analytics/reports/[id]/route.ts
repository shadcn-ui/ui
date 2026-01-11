import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/analytics/reports/[id]
 * Get detailed report template information
 */
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const query = `
      SELECT 
        rt.*,
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', rs.id,
              'schedule_name', rs.schedule_name,
              'schedule_frequency', rs.schedule_frequency,
              'next_run_at', rs.next_run_at,
              'is_active', rs.is_active
            ) ORDER BY rs.created_at DESC
          )
          FROM report_schedules rs
          WHERE rs.report_template_id = rt.id
        ) as schedules,
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', re.id,
              'execution_type', re.execution_type,
              'started_at', re.started_at,
              'completed_at', re.completed_at,
              'status', re.status,
              'rows_returned', re.rows_returned,
              'output_file_url', re.output_file_url
            ) ORDER BY re.started_at DESC
          )
          FROM (
            SELECT * FROM report_executions
            WHERE report_template_id = rt.id
            ORDER BY started_at DESC
            LIMIT 10
          ) re
        ) as recent_executions
      FROM report_templates rt
      WHERE rt.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Report template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      report: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/analytics/reports/[id]
 * Update a report template
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
      'report_name', 'description', 'query_sql', 'report_format',
      'parameters', 'default_parameters', 'template_layout', 'chart_configs',
      'is_scheduled', 'is_public', 'allowed_roles', 'is_active'
    ];

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(body)) {
      if (allowedFields.includes(key)) {
        if (['parameters', 'default_parameters', 'template_layout', 'chart_configs', 'allowed_roles'].includes(key)) {
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
      UPDATE report_templates
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Report template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Report template updated successfully',
      report: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * DELETE /api/analytics/reports/[id]
 * Delete a report template
 */
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  const client = await pool.connect();
  
  try {
    const { id } = await context.params;

    const query = 'DELETE FROM report_templates WHERE id = $1 RETURNING *';
    const result = await client.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Report template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Report template deleted successfully',
      report: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
