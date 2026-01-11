import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * GET /api/operations/schedules/[id]/gantt
 * Get Gantt chart data for a schedule
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const scheduleId = context.params.id;

    // Get schedule info
    const scheduleResult = await query(
      `SELECT id, schedule_name, start_date, end_date, status
       FROM production_schedules WHERE id = $1`,
      [scheduleId]
    );

    if (scheduleResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    const schedule = scheduleResult.rows[0];

    // Get tasks (work orders with operations)
    const tasksResult = await query(
      `SELECT 
        sa.id as assignment_id,
        sa.work_order_id,
        wo.wo_number,
        wo.product_name,
        sa.sequence_number,
        sa.scheduled_start_time,
        sa.scheduled_end_time,
        sa.actual_start_time,
        sa.actual_end_time,
        sa.status,
        sa.is_critical_path,
        sa.predecessor_assignments,
        sa.successor_assignments,
        wo.priority,
        COALESCE(
          (sa.actual_end_time - sa.actual_start_time),
          (sa.scheduled_end_time - sa.scheduled_start_time)
        ) as duration,
        CASE 
          WHEN sa.actual_end_time IS NOT NULL THEN 100
          WHEN sa.actual_start_time IS NOT NULL THEN 
            LEAST(100, GREATEST(0,
              EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - sa.actual_start_time)) /
              NULLIF(EXTRACT(EPOCH FROM (sa.scheduled_end_time - sa.scheduled_start_time)), 0) * 100
            ))
          ELSE 0
        END as progress_percentage
       FROM schedule_assignments sa
       JOIN work_orders wo ON wo.id = sa.work_order_id
       WHERE sa.schedule_id = $1
       AND sa.scheduled_start_time IS NOT NULL
       ORDER BY sa.sequence_number`,
      [scheduleId]
    );

    // Get operations for each task
    const operationsResult = await query(
      `SELECT 
        soa.id,
        soa.schedule_assignment_id,
        soa.work_order_operation_id,
        woo.operation_sequence,
        woo.operation_name,
        soa.workstation_id,
        w.name as workstation_name,
        w.code as workstation_code,
        soa.scheduled_start_time,
        soa.scheduled_end_time,
        soa.actual_start_time,
        soa.actual_end_time,
        soa.duration_minutes,
        soa.status
       FROM schedule_operation_assignments soa
       JOIN work_order_operations woo ON woo.id = soa.work_order_operation_id
       LEFT JOIN workstations w ON w.id = soa.workstation_id
       WHERE soa.schedule_assignment_id = ANY(
         SELECT id FROM schedule_assignments WHERE schedule_id = $1
       )
       ORDER BY soa.schedule_assignment_id, woo.operation_sequence`,
      [scheduleId]
    );

    // Group operations by assignment
    const operationsByAssignment: Record<number, any[]> = {};
    for (const op of operationsResult.rows) {
      const assignmentId = op.schedule_assignment_id;
      if (!operationsByAssignment[assignmentId]) {
        operationsByAssignment[assignmentId] = [];
      }
      operationsByAssignment[assignmentId].push({
        id: op.id,
        operation_id: op.work_order_operation_id,
        sequence: op.operation_sequence,
        name: op.operation_name,
        workstation: op.workstation_id ? {
          id: op.workstation_id,
          name: op.workstation_name,
          code: op.workstation_code,
        } : null,
        start: op.scheduled_start_time,
        end: op.scheduled_end_time,
        actual_start: op.actual_start_time,
        actual_end: op.actual_end_time,
        duration_minutes: Number(op.duration_minutes),
        status: op.status,
      });
    }

    // Format tasks for Gantt chart
    const tasks = tasksResult.rows.map(row => ({
      id: `task-${row.assignment_id}`,
      assignment_id: row.assignment_id,
      work_order_id: row.work_order_id,
      name: `${row.wo_number} - ${row.product_name}`,
      start: row.scheduled_start_time,
      end: row.scheduled_end_time,
      actual_start: row.actual_start_time,
      actual_end: row.actual_end_time,
      duration: row.duration,
      progress: Math.round(Number(row.progress_percentage || 0)),
      status: row.status,
      priority: row.priority,
      is_critical_path: row.is_critical_path,
      dependencies: (row.predecessor_assignments || []).map((id: number) => `task-${id}`),
      operations: operationsByAssignment[row.assignment_id] || [],
      styles: {
        backgroundColor: row.is_critical_path ? '#ef4444' : 
                        row.priority === 'urgent' ? '#f97316' :
                        row.priority === 'high' ? '#3b82f6' : '#64748b',
        progressColor: row.status === 'completed' ? '#22c55e' :
                       row.status === 'in_progress' ? '#3b82f6' : '#94a3b8',
      },
    }));

    // Get resource (workstation) utilization
    const resourcesResult = await query(
      `SELECT 
        w.id,
        w.name,
        w.code,
        COUNT(DISTINCT soa.id) as total_operations,
        SUM(soa.duration_minutes) as total_duration_minutes,
        MIN(soa.scheduled_start_time) as first_operation,
        MAX(soa.scheduled_end_time) as last_operation
       FROM workstations w
       LEFT JOIN schedule_operation_assignments soa ON soa.workstation_id = w.id
       WHERE soa.schedule_assignment_id = ANY(
         SELECT id FROM schedule_assignments WHERE schedule_id = $1
       )
       GROUP BY w.id, w.name, w.code
       ORDER BY w.name`,
      [scheduleId]
    );

    const resources = resourcesResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      code: row.code,
      operations_count: Number(row.total_operations),
      total_duration_minutes: Number(row.total_duration_minutes || 0),
      first_operation: row.first_operation,
      last_operation: row.last_operation,
    }));

    // Calculate statistics
    const stats = {
      total_tasks: tasks.length,
      completed_tasks: tasks.filter(t => t.status === 'completed').length,
      in_progress_tasks: tasks.filter(t => t.status === 'in_progress').length,
      pending_tasks: tasks.filter(t => t.status === 'pending' || t.status === 'scheduled').length,
      critical_path_tasks: tasks.filter(t => t.is_critical_path).length,
      avg_progress: tasks.length > 0 
        ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length)
        : 0,
    };

    return NextResponse.json({
      schedule: {
        id: schedule.id,
        name: schedule.schedule_name,
        start_date: schedule.start_date,
        end_date: schedule.end_date,
        status: schedule.status,
      },
      tasks,
      resources,
      statistics: stats,
      view_config: {
        view_mode: 'Day', // Day, Week, Month
        column_width: 65,
        show_progress: true,
        show_dependencies: true,
        show_critical_path: true,
      },
    });
  } catch (error: any) {
    console.error('Gantt chart data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Gantt chart data', details: error.message },
      { status: 500 }
    );
  }
}
