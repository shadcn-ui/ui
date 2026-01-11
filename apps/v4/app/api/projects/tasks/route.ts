import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/projects/tasks - List tasks with filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const project_id = searchParams.get('project_id');
    const phase_id = searchParams.get('phase_id');
    const assigned_to = searchParams.get('assigned_to');
    const task_status = searchParams.get('task_status');
    const priority = searchParams.get('priority');
    const task_type = searchParams.get('task_type');
    const search = searchParams.get('search');
    const is_blocked = searchParams.get('is_blocked');
    const is_billable = searchParams.get('is_billable');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let conditions: string[] = ['t.is_active = TRUE'];
    let params: any[] = [];
    let paramIndex = 1;

    if (project_id) {
      conditions.push(`t.project_id = $${paramIndex++}`);
      params.push(project_id);
    }

    if (phase_id) {
      conditions.push(`t.phase_id = $${paramIndex++}`);
      params.push(phase_id);
    }

    if (assigned_to) {
      conditions.push(`t.assigned_to = $${paramIndex++}`);
      params.push(assigned_to);
    }

    if (task_status) {
      conditions.push(`t.task_status = $${paramIndex++}`);
      params.push(task_status);
    }

    if (priority) {
      conditions.push(`t.priority = $${paramIndex++}`);
      params.push(priority);
    }

    if (task_type) {
      conditions.push(`t.task_type = $${paramIndex++}`);
      params.push(task_type);
    }

    if (is_blocked === 'true') {
      conditions.push(`t.is_blocked = TRUE`);
    }

    if (is_billable !== null && is_billable !== undefined) {
      conditions.push(`t.is_billable = $${paramIndex++}`);
      params.push(is_billable === 'true');
    }

    if (search) {
      conditions.push(`(t.task_name ILIKE $${paramIndex} OR t.task_description ILIKE $${paramIndex} OR t.task_code ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM project_tasks t ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Get tasks with related information
    const tasksQuery = `
      SELECT 
        t.*,
        p.project_name,
        p.project_code,
        ph.phase_name,
        m.milestone_name,
        -- Dependencies count
        (SELECT COUNT(*) FROM project_task_dependencies WHERE task_id = t.task_id) as dependency_count,
        -- Time logged
        (SELECT SUM(hours_worked) FROM project_time_entries WHERE task_id = t.task_id) as total_hours_logged,
        -- Check if overdue
        CASE 
          WHEN t.due_date < CURRENT_DATE AND t.task_status NOT IN ('completed', 'cancelled') 
          THEN TRUE 
          ELSE FALSE 
        END as is_overdue
      FROM project_tasks t
      JOIN projects p ON t.project_id = p.project_id
      LEFT JOIN project_phases ph ON t.phase_id = ph.phase_id
      LEFT JOIN project_milestones m ON t.milestone_id = m.milestone_id
      ${whereClause}
      ORDER BY 
        CASE t.priority 
          WHEN 'critical' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
        END,
        t.due_date NULLS LAST,
        t.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);
    const result = await query(tasksQuery, params);

    // Calculate statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(*) FILTER (WHERE task_status = 'todo') as todo_count,
        COUNT(*) FILTER (WHERE task_status = 'in_progress') as in_progress_count,
        COUNT(*) FILTER (WHERE task_status = 'completed') as completed_count,
        COUNT(*) FILTER (WHERE task_status = 'blocked') as blocked_count,
        COUNT(*) FILTER (WHERE is_blocked = TRUE) as total_blocked,
        COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND task_status NOT IN ('completed', 'cancelled')) as overdue_count,
        SUM(estimated_hours) as total_estimated_hours,
        SUM(actual_hours) as total_actual_hours,
        AVG(completion_percentage) as avg_completion_percentage
      FROM project_tasks t
      ${whereClause}
    `;

    const statsResult = await query(statsQuery, conditions.length > 0 ? params.slice(0, -2) : []);

    return NextResponse.json({
      tasks: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      statistics: statsResult.rows[0]
    });

  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/projects/tasks - Create new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      project_id,
      phase_id,
      milestone_id,
      parent_task_id,
      task_code,
      task_name,
      task_description,
      assigned_to,
      assigned_by,
      planned_start_date,
      planned_end_date,
      due_date,
      estimated_hours,
      task_status = 'todo',
      priority = 'medium',
      task_type = 'task',
      is_billable = true,
      billable_rate,
      story_points,
      complexity,
      tags = [],
      custom_fields = {},
      created_by
    } = body;

    // Validation
    if (!project_id || !task_name) {
      return NextResponse.json(
        { error: 'Missing required fields: project_id, task_name' },
        { status: 400 }
      );
    }

    // Verify project exists
    const projectCheck = await query(
      'SELECT project_id FROM projects WHERE project_id = $1',
      [project_id]
    );

    if (projectCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const insertQuery = `
      INSERT INTO project_tasks (
        project_id, phase_id, milestone_id, parent_task_id,
        task_code, task_name, task_description,
        assigned_to, assigned_by, assigned_date,
        planned_start_date, planned_end_date, due_date,
        estimated_hours, remaining_hours,
        task_status, priority, task_type,
        is_billable, billable_rate,
        story_points, complexity,
        tags, custom_fields,
        created_by, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, 
        CASE WHEN $8 IS NOT NULL THEN CURRENT_TIMESTAMP ELSE NULL END,
        $10, $11, $12, $13, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, CURRENT_TIMESTAMP
      )
      RETURNING *
    `;

    const result = await query(insertQuery, [
      project_id, phase_id, milestone_id, parent_task_id,
      task_code, task_name, task_description,
      assigned_to, assigned_by,
      planned_start_date, planned_end_date, due_date,
      estimated_hours,
      task_status, priority, task_type,
      is_billable, billable_rate,
      story_points, complexity,
      tags, custom_fields,
      created_by
    ]);

    return NextResponse.json({
      message: 'Task created successfully',
      task: result.rows[0]
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task', details: error.message },
      { status: 500 }
    );
  }
}
