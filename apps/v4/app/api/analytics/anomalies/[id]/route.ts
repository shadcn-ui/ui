import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/analytics/anomalies/[id]
 * Get detailed information about a specific anomaly
 */
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const query = `
      SELECT 
        da.*,
        adr.rule_name,
        adr.rule_code,
        adr.detection_method,
        adr.target_metric,
        adr.sensitivity
      FROM detected_anomalies da
      JOIN anomaly_detection_rules adr ON da.rule_id = adr.id
      WHERE da.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Anomaly not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      anomaly: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error fetching anomaly:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/analytics/anomalies/[id]
 * Update anomaly status (mark as resolved, false positive, etc.)
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
      'is_investigated', 'investigation_notes', 'root_cause',
      'is_resolved', 'resolution_action',
      'is_false_positive', 'false_positive_reason'
    ];

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(body)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
        
        // Auto-set timestamp fields
        if (key === 'is_investigated' && value === true) {
          updates.push(`investigated_at = CURRENT_TIMESTAMP`);
          if (body.investigated_by) {
            updates.push(`investigated_by = $${paramIndex}`);
            values.push(body.investigated_by);
            paramIndex++;
          }
        } else if (key === 'is_resolved' && value === true) {
          updates.push(`resolved_at = CURRENT_TIMESTAMP`);
          if (body.resolved_by) {
            updates.push(`resolved_by = $${paramIndex}`);
            values.push(body.resolved_by);
            paramIndex++;
          }
        }
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    values.push(id);

    const query = `
      UPDATE detected_anomalies
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Anomaly not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Anomaly updated successfully',
      anomaly: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error updating anomaly:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
