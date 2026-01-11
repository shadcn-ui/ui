import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * GET /api/operations/schedules
 * Get production schedules
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    let queryText = `
      SELECT 
        ps.id,
        ps.schedule_name,
        ps.schedule_type,
        ps.start_date,
        ps.end_date,
        ps.status,
        ps.priority,
        ps.scheduling_method,
        ps.created_by,
        ps.created_at,
        ps.updated_at,
        COUNT(DISTINCT sa.id) as total_assignments,
        COUNT(DISTINCT CASE WHEN sa.status = 'scheduled' THEN sa.id END) as scheduled_count,
        COUNT(DISTINCT CASE WHEN sa.status = 'in_progress' THEN sa.id END) as in_progress_count,
        COUNT(DISTINCT CASE WHEN sa.status = 'completed' THEN sa.id END) as completed_count
      FROM production_schedules ps
      LEFT JOIN schedule_assignments sa ON sa.schedule_id = ps.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      queryText += ` AND ps.status = $${paramCount}`;
      params.push(status);
    }

    if (startDate) {
      paramCount++;
      queryText += ` AND ps.start_date >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      queryText += ` AND ps.end_date <= $${paramCount}`;
      params.push(endDate);
    }

    queryText += `
      GROUP BY ps.id, ps.schedule_name, ps.schedule_type, ps.start_date, ps.end_date,
               ps.status, ps.priority, ps.scheduling_method, ps.created_by,
               ps.created_at, ps.updated_at
      ORDER BY ps.start_date DESC, ps.created_at DESC
    `;

    const result = await query(queryText, params);

    return NextResponse.json({
      schedules: result.rows.map(row => ({
        id: row.id,
        schedule_name: row.schedule_name,
        schedule_type: row.schedule_type,
        start_date: row.start_date,
        end_date: row.end_date,
        status: row.status,
        priority: row.priority,
        scheduling_method: row.scheduling_method,
        created_by: row.created_by,
        created_at: row.created_at,
        updated_at: row.updated_at,
        statistics: {
          total_assignments: Number(row.total_assignments),
          scheduled_count: Number(row.scheduled_count),
          in_progress_count: Number(row.in_progress_count),
          completed_count: Number(row.completed_count),
        },
      })),
    });
  } catch (error: any) {
    console.error('Schedules GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedules', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/operations/schedules
 * Create a new production schedule
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      schedule_name,
      schedule_type,
      start_date,
      end_date,
      work_order_ids,
      scheduling_method,
      priority,
      notes,
      created_by,
    } = body;

    // Validate required fields
    if (!schedule_name || !start_date || !end_date) {
      return NextResponse.json(
        { error: 'Missing required fields: schedule_name, start_date, end_date' },
        { status: 400 }
      );
    }

    // Create schedule
    const scheduleResult = await query(
      `INSERT INTO production_schedules (
        schedule_name, schedule_type, start_date, end_date,
        scheduling_method, priority, notes, created_by, status
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'draft')
       RETURNING id, schedule_name, schedule_type, start_date, end_date,
                 scheduling_method, priority, status, created_at`,
      [
        schedule_name,
        schedule_type || 'finite_capacity',
        start_date,
        end_date,
        scheduling_method || 'forward',
        priority || 'medium',
        notes,
        created_by,
      ]
    );

    const schedule = scheduleResult.rows[0];

    // Add work orders to schedule if provided
    if (work_order_ids && work_order_ids.length > 0) {
      for (const workOrderId of work_order_ids) {
        await query(
          `INSERT INTO schedule_assignments (
            schedule_id, work_order_id, status, sequence_number
           ) VALUES ($1, $2, 'pending', 
             (SELECT COALESCE(MAX(sequence_number), 0) + 1 
              FROM schedule_assignments WHERE schedule_id = $1)
           )`,
          [schedule.id, workOrderId]
        );
      }
    }

    return NextResponse.json(
      {
        message: 'Production schedule created successfully',
        schedule: {
          id: schedule.id,
          schedule_name: schedule.schedule_name,
          schedule_type: schedule.schedule_type,
          start_date: schedule.start_date,
          end_date: schedule.end_date,
          scheduling_method: schedule.scheduling_method,
          priority: schedule.priority,
          status: schedule.status,
          created_at: schedule.created_at,
          work_orders_added: work_order_ids?.length || 0,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Schedules POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create schedule', details: error.message },
      { status: 500 }
    );
  }
}
