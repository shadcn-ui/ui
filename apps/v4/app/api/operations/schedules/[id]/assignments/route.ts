import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * GET /api/operations/schedules/[id]/assignments
 * Get schedule assignments
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const scheduleId = context.params.id;

    const result = await query(
      `SELECT 
        sa.id,
        sa.schedule_id,
        sa.work_order_id,
        wo.wo_number,
        wo.product_name,
        wo.product_code,
        wo.quantity_to_produce,
        wo.priority as wo_priority,
        sa.sequence_number,
        sa.scheduled_start_time,
        sa.scheduled_end_time,
        sa.actual_start_time,
        sa.actual_end_time,
        sa.status,
        sa.is_critical_path,
        sa.slack_time_minutes,
        sa.predecessor_assignments,
        sa.successor_assignments,
        sa.notes,
        COUNT(DISTINCT soa.id) as operation_count,
        COUNT(DISTINCT CASE WHEN soa.status = 'completed' THEN soa.id END) as completed_operations
       FROM schedule_assignments sa
       JOIN work_orders wo ON wo.id = sa.work_order_id
       LEFT JOIN schedule_operation_assignments soa ON soa.schedule_assignment_id = sa.id
       WHERE sa.schedule_id = $1
       GROUP BY sa.id, sa.schedule_id, sa.work_order_id, wo.wo_number, wo.product_name,
                wo.product_code, wo.quantity_to_produce, wo.priority, sa.sequence_number,
                sa.scheduled_start_time, sa.scheduled_end_time, sa.actual_start_time,
                sa.actual_end_time, sa.status, sa.is_critical_path, sa.slack_time_minutes,
                sa.predecessor_assignments, sa.successor_assignments, sa.notes
       ORDER BY sa.sequence_number, sa.scheduled_start_time NULLS LAST`,
      [scheduleId]
    );

    return NextResponse.json({
      schedule_id: scheduleId,
      assignments: result.rows.map(row => ({
        id: row.id,
        work_order: {
          id: row.work_order_id,
          wo_number: row.wo_number,
          product_name: row.product_name,
          product_code: row.product_code,
          quantity: Number(row.quantity_to_produce),
          priority: row.wo_priority,
        },
        sequence_number: row.sequence_number,
        scheduled_start: row.scheduled_start_time,
        scheduled_end: row.scheduled_end_time,
        actual_start: row.actual_start_time,
        actual_end: row.actual_end_time,
        status: row.status,
        is_critical_path: row.is_critical_path,
        slack_minutes: Number(row.slack_time_minutes || 0),
        predecessors: row.predecessor_assignments || [],
        successors: row.successor_assignments || [],
        operation_count: Number(row.operation_count),
        completed_operations: Number(row.completed_operations),
        notes: row.notes,
      })),
    });
  } catch (error: any) {
    console.error('Schedule assignments GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule assignments', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/operations/schedules/[id]/assignments
 * Manual adjustment of schedule assignments
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const scheduleId = context.params.id;
    const body = await request.json();
    const { assignment_id, updates } = body;

    if (!assignment_id) {
      return NextResponse.json(
        { error: 'Missing required field: assignment_id' },
        { status: 400 }
      );
    }

    // Build dynamic update query
    const allowedFields = [
      'scheduled_start_time',
      'scheduled_end_time',
      'sequence_number',
      'status',
      'predecessor_assignments',
      'successor_assignments',
      'notes',
    ];

    const updateParts: string[] = [];
    const params: any[] = [];
    let paramCount = 0;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        paramCount++;
        updateParts.push(`${key} = $${paramCount}`);
        params.push(value);
      }
    }

    if (updateParts.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    paramCount++;
    params.push(assignment_id);
    paramCount++;
    params.push(scheduleId);

    const queryText = `
      UPDATE schedule_assignments
      SET ${updateParts.join(', ')},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount - 1}
      AND schedule_id = $${paramCount}
      RETURNING id, work_order_id, sequence_number, scheduled_start_time,
                scheduled_end_time, status, notes
    `;

    const result = await query(queryText, params);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Assignment not found or does not belong to this schedule' },
        { status: 404 }
      );
    }

    // If times were changed, update operation assignments proportionally
    if (updates.scheduled_start_time || updates.scheduled_end_time) {
      await query(
        `UPDATE schedule_operation_assignments soa
         SET scheduled_start_time = sa.scheduled_start_time + 
           (soa.scheduled_start_time - sa.scheduled_start_time),
             scheduled_end_time = sa.scheduled_start_time + 
           (soa.scheduled_end_time - sa.scheduled_start_time)
         FROM schedule_assignments sa
         WHERE soa.schedule_assignment_id = sa.id
         AND sa.id = $1`,
        [assignment_id]
      );
    }

    // Re-check for conflicts
    const conflictsResult = await query(
      `SELECT * FROM detect_schedule_conflicts($1)`,
      [scheduleId]
    );

    return NextResponse.json({
      message: 'Assignment updated successfully',
      assignment: {
        id: result.rows[0].id,
        work_order_id: result.rows[0].work_order_id,
        sequence_number: result.rows[0].sequence_number,
        scheduled_start: result.rows[0].scheduled_start_time,
        scheduled_end: result.rows[0].scheduled_end_time,
        status: result.rows[0].status,
        notes: result.rows[0].notes,
      },
      conflicts_detected: conflictsResult.rows.length,
    });
  } catch (error: any) {
    console.error('Schedule assignments PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update assignment', details: error.message },
      { status: 500 }
    );
  }
}
