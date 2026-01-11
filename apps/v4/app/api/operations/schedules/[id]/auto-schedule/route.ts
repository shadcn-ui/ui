import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * POST /api/operations/schedules/[id]/auto-schedule
 * Auto-schedule work orders using finite capacity scheduling algorithm
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const scheduleId = context.params.id;
    const body = await request.json();
    const {
      method = 'forward', // forward, backward
      consider_capacity = true,
      consider_dependencies = true,
      optimize_for = 'earliest_completion', // earliest_completion, resource_utilization, minimize_makespan
    } = body;

    // Get schedule details
    const scheduleResult = await query(
      `SELECT id, schedule_name, start_date, end_date, scheduling_method
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

    // Get unscheduled work orders in this schedule
    const workOrdersResult = await query(
      `SELECT 
        sa.id as assignment_id,
        sa.work_order_id,
        wo.product_name,
        wo.quantity_to_produce,
        wo.priority,
        sa.predecessor_assignments,
        sa.successor_assignments
       FROM schedule_assignments sa
       JOIN work_orders wo ON wo.id = sa.work_order_id
       WHERE sa.schedule_id = $1
       AND sa.status IN ('pending', 'scheduled')
       ORDER BY 
         CASE wo.priority
           WHEN 'urgent' THEN 1
           WHEN 'high' THEN 2
           WHEN 'normal' THEN 3
           WHEN 'low' THEN 4
         END,
         wo.planned_start_date NULLS LAST,
         sa.sequence_number`,
      [scheduleId]
    );

    if (workOrdersResult.rows.length === 0) {
      return NextResponse.json({
        message: 'No work orders to schedule',
        schedule_id: scheduleId,
        scheduled_count: 0,
      });
    }

    let scheduledCount = 0;
    let currentDate = new Date(schedule.start_date);
    const endDate = new Date(schedule.end_date);

    // Simple forward scheduling algorithm
    for (const assignment of workOrdersResult.rows) {
      // Get work order operations
      const operationsResult = await query(
        `SELECT 
          woo.id,
          woo.operation_sequence,
          woo.workstation_id,
          woo.setup_time_minutes,
          woo.run_time_minutes,
          woo.quantity
         FROM work_order_operations woo
         WHERE woo.work_order_id = $1
         ORDER BY woo.operation_sequence`,
        [assignment.work_order_id]
      );

      if (operationsResult.rows.length === 0) {
        // No operations defined, skip
        continue;
      }

      let operationStartDate = new Date(currentDate);

      // Schedule each operation
      for (const operation of operationsResult.rows) {
        const totalMinutes = Number(operation.setup_time_minutes || 0) + 
                           Number(operation.run_time_minutes || 0);
        
        if (consider_capacity && operation.workstation_id) {
          // Check workstation capacity
          const capacityResult = await query(
            `SELECT * FROM calculate_workstation_capacity($1::UUID, $2::DATE)`,
            [operation.workstation_id, operationStartDate.toISOString().split('T')[0]]
          );

          if (capacityResult.rows.length > 0) {
            const capacity = capacityResult.rows[0];
            const freeMinutes = Number(capacity.free_minutes || 0);

            // If not enough capacity, move to next day
            if (freeMinutes < totalMinutes) {
              operationStartDate.setDate(operationStartDate.getDate() + 1);
            }
          }
        }

        // Calculate end time (simplified - assumes 8-hour workday)
        const operationEndDate = new Date(operationStartDate);
        const workingHours = Math.ceil(totalMinutes / 60);
        operationEndDate.setHours(operationEndDate.getHours() + workingHours);

        // Insert/update operation assignment
        await query(
          `INSERT INTO schedule_operation_assignments (
            schedule_assignment_id,
            work_order_operation_id,
            workstation_id,
            scheduled_start_time,
            scheduled_end_time,
            duration_minutes,
            setup_minutes,
            run_minutes,
            status
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'scheduled')
           ON CONFLICT (work_order_operation_id) 
           DO UPDATE SET
             scheduled_start_time = EXCLUDED.scheduled_start_time,
             scheduled_end_time = EXCLUDED.scheduled_end_time,
             duration_minutes = EXCLUDED.duration_minutes,
             status = 'scheduled'`,
          [
            assignment.assignment_id,
            operation.id,
            operation.workstation_id,
            operationStartDate.toISOString(),
            operationEndDate.toISOString(),
            totalMinutes,
            operation.setup_time_minutes || 0,
            operation.run_time_minutes || 0,
          ]
        );

        // Update capacity allocation
        if (consider_capacity && operation.workstation_id) {
          await query(
            `INSERT INTO capacity_allocations (
              workstation_id,
              allocation_date,
              available_minutes,
              allocated_minutes
             ) VALUES (
              $1,
              $2,
              480, -- 8 hours default
              $3
             )
             ON CONFLICT (workstation_id, allocation_date, shift_name)
             DO UPDATE SET
               allocated_minutes = capacity_allocations.allocated_minutes + EXCLUDED.allocated_minutes,
               updated_at = CURRENT_TIMESTAMP`,
            [
              operation.workstation_id,
              operationStartDate.toISOString().split('T')[0],
              totalMinutes,
            ]
          );
        }

        // Next operation starts after this one
        operationStartDate = new Date(operationEndDate);
      }

      // Update assignment status
      await query(
        `UPDATE schedule_assignments
         SET status = 'scheduled',
             scheduled_start_time = (
               SELECT MIN(scheduled_start_time)
               FROM schedule_operation_assignments
               WHERE schedule_assignment_id = $1
             ),
             scheduled_end_time = (
               SELECT MAX(scheduled_end_time)
               FROM schedule_operation_assignments
               WHERE schedule_assignment_id = $1
             )
         WHERE id = $1`,
        [assignment.assignment_id]
      );

      scheduledCount++;
      currentDate = operationStartDate;

      // Check if we've exceeded the schedule end date
      if (currentDate > endDate) {
        break;
      }
    }

    // Update schedule status
    await query(
      `UPDATE production_schedules
       SET status = 'scheduled',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [scheduleId]
    );

    // Detect conflicts
    const conflictsResult = await query(
      `SELECT * FROM detect_schedule_conflicts($1)`,
      [scheduleId]
    );

    return NextResponse.json({
      message: 'Auto-scheduling completed',
      schedule_id: scheduleId,
      scheduled_count: scheduledCount,
      total_assignments: workOrdersResult.rows.length,
      conflicts_detected: conflictsResult.rows.length,
      conflicts: conflictsResult.rows.map(row => ({
        type: row.conflict_type,
        severity: row.severity,
        description: row.description,
      })),
      method_used: method,
      capacity_considered: consider_capacity,
    });
  } catch (error: any) {
    console.error('Auto-schedule error:', error);
    return NextResponse.json(
      { error: 'Failed to auto-schedule', details: error.message },
      { status: 500 }
    );
  }
}
