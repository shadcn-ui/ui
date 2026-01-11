import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/projects/time-entries - List time entries
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const project_id = searchParams.get('project_id');
    const task_id = searchParams.get('task_id');
    const user_id = searchParams.get('user_id');
    const is_billable = searchParams.get('is_billable');
    const is_approved = searchParams.get('is_approved');
    const is_invoiced = searchParams.get('is_invoiced');
    const from_date = searchParams.get('from_date');
    const to_date = searchParams.get('to_date');
    const activity_type = searchParams.get('activity_type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let conditions: string[] = [];
    let params: any[] = [];
    let paramIndex = 1;

    if (project_id) {
      conditions.push(`te.project_id = $${paramIndex++}`);
      params.push(project_id);
    }

    if (task_id) {
      conditions.push(`te.task_id = $${paramIndex++}`);
      params.push(task_id);
    }

    if (user_id) {
      conditions.push(`te.user_id = $${paramIndex++}`);
      params.push(user_id);
    }

    if (is_billable !== null && is_billable !== undefined) {
      conditions.push(`te.is_billable = $${paramIndex++}`);
      params.push(is_billable === 'true');
    }

    if (is_approved !== null && is_approved !== undefined) {
      conditions.push(`te.is_approved = $${paramIndex++}`);
      params.push(is_approved === 'true');
    }

    if (is_invoiced !== null && is_invoiced !== undefined) {
      conditions.push(`te.is_invoiced = $${paramIndex++}`);
      params.push(is_invoiced === 'true');
    }

    if (from_date) {
      conditions.push(`te.entry_date >= $${paramIndex++}`);
      params.push(from_date);
    }

    if (to_date) {
      conditions.push(`te.entry_date <= $${paramIndex++}`);
      params.push(to_date);
    }

    if (activity_type) {
      conditions.push(`te.activity_type = $${paramIndex++}`);
      params.push(activity_type);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM project_time_entries te ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Get time entries
    const entriesQuery = `
      SELECT 
        te.*,
        p.project_name,
        p.project_code,
        pt.task_name,
        pt.task_code,
        ph.phase_name
      FROM project_time_entries te
      JOIN projects p ON te.project_id = p.project_id
      LEFT JOIN project_tasks pt ON te.task_id = pt.task_id
      LEFT JOIN project_phases ph ON te.phase_id = ph.phase_id
      ${whereClause}
      ORDER BY te.entry_date DESC, te.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);
    const result = await query(entriesQuery, params);

    // Calculate statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_entries,
        SUM(hours_worked) as total_hours,
        SUM(CASE WHEN is_billable = TRUE THEN hours_worked ELSE 0 END) as billable_hours,
        SUM(CASE WHEN is_billable = FALSE THEN hours_worked ELSE 0 END) as non_billable_hours,
        SUM(billable_amount) as total_billable_amount,
        SUM(CASE WHEN is_approved = TRUE THEN hours_worked ELSE 0 END) as approved_hours,
        SUM(CASE WHEN is_invoiced = TRUE THEN hours_worked ELSE 0 END) as invoiced_hours,
        SUM(CASE WHEN is_invoiced = FALSE AND is_billable = TRUE THEN billable_amount ELSE 0 END) as unbilled_amount,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT project_id) as unique_projects
      FROM project_time_entries te
      ${whereClause}
    `;

    const statsResult = await query(statsQuery, conditions.length > 0 ? params.slice(0, -2) : []);

    return NextResponse.json({
      time_entries: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      statistics: statsResult.rows[0]
    });

  } catch (error: any) {
    console.error('Error fetching time entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch time entries', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/projects/time-entries - Log time entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      project_id,
      task_id,
      phase_id,
      user_id,
      resource_id,
      entry_date,
      start_time,
      end_time,
      hours_worked,
      is_billable = true,
      billing_rate,
      work_description,
      activity_type,
      work_location,
      is_overtime = false,
      overtime_multiplier = 1.00,
      created_by
    } = body;

    // Validation
    if (!project_id || !user_id || !entry_date || !hours_worked || !work_description) {
      return NextResponse.json(
        { error: 'Missing required fields: project_id, user_id, entry_date, hours_worked, work_description' },
        { status: 400 }
      );
    }

    if (hours_worked <= 0 || hours_worked > 24) {
      return NextResponse.json(
        { error: 'Hours worked must be between 0 and 24' },
        { status: 400 }
      );
    }

    // Verify project exists
    const projectCheck = await query(
      'SELECT project_id, billing_rate_per_hour FROM projects WHERE project_id = $1',
      [project_id]
    );

    if (projectCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Use project's billing rate if not provided
    const finalBillingRate = billing_rate || projectCheck.rows[0].billing_rate_per_hour || 0;

    // If task is provided, verify it belongs to the project
    if (task_id) {
      const taskCheck = await query(
        'SELECT task_id FROM project_tasks WHERE task_id = $1 AND project_id = $2',
        [task_id, project_id]
      );

      if (taskCheck.rows.length === 0) {
        return NextResponse.json(
          { error: 'Task not found or does not belong to specified project' },
          { status: 404 }
        );
      }
    }

    const insertQuery = `
      INSERT INTO project_time_entries (
        project_id, task_id, phase_id,
        user_id, resource_id,
        entry_date, start_time, end_time, hours_worked,
        is_billable, billing_rate,
        work_description, activity_type, work_location,
        is_overtime, overtime_multiplier,
        created_by, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, CURRENT_TIMESTAMP
      )
      RETURNING *
    `;

    const result = await query(insertQuery, [
      project_id, task_id, phase_id,
      user_id, resource_id,
      entry_date, start_time, end_time, hours_worked,
      is_billable, finalBillingRate,
      work_description, activity_type, work_location,
      is_overtime, overtime_multiplier,
      created_by
    ]);

    return NextResponse.json({
      message: 'Time entry logged successfully',
      time_entry: result.rows[0]
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error logging time entry:', error);
    return NextResponse.json(
      { error: 'Failed to log time entry', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/projects/time-entries/approve - Bulk approve time entries
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { time_entry_ids, approved_by, approve_all_for_user, user_id, from_date, to_date } = body;

    if (!approved_by) {
      return NextResponse.json(
        { error: 'approved_by is required' },
        { status: 400 }
      );
    }

    let updateQuery: string;
    let params: any[];

    if (approve_all_for_user && user_id) {
      // Approve all entries for a user within date range
      let conditions = ['user_id = $1', 'is_approved = FALSE'];
      params = [user_id];
      let paramIndex = 2;

      if (from_date) {
        conditions.push(`entry_date >= $${paramIndex++}`);
        params.push(from_date);
      }

      if (to_date) {
        conditions.push(`entry_date <= $${paramIndex++}`);
        params.push(to_date);
      }

      updateQuery = `
        UPDATE project_time_entries
        SET is_approved = TRUE, approved_by = $${paramIndex}, approved_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE ${conditions.join(' AND ')}
        RETURNING *
      `;
      params.push(approved_by);

    } else if (time_entry_ids && Array.isArray(time_entry_ids) && time_entry_ids.length > 0) {
      // Approve specific time entries
      const placeholders = time_entry_ids.map((_, i) => `$${i + 1}`).join(', ');
      updateQuery = `
        UPDATE project_time_entries
        SET is_approved = TRUE, approved_by = $${time_entry_ids.length + 1}, approved_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE time_entry_id IN (${placeholders}) AND is_approved = FALSE
        RETURNING *
      `;
      params = [...time_entry_ids, approved_by];

    } else {
      return NextResponse.json(
        { error: 'Either time_entry_ids or (approve_all_for_user with user_id) must be provided' },
        { status: 400 }
      );
    }

    const result = await query(updateQuery, params);

    return NextResponse.json({
      message: `${result.rows.length} time ${result.rows.length === 1 ? 'entry' : 'entries'} approved successfully`,
      approved_count: result.rows.length,
      time_entries: result.rows
    });

  } catch (error: any) {
    console.error('Error approving time entries:', error);
    return NextResponse.json(
      { error: 'Failed to approve time entries', details: error.message },
      { status: 500 }
    );
  }
}
