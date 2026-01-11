import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/projects/tasks/[id] - Get task details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;

    const result = await query(
      `SELECT 
        t.*,
        p.project_name,
        p.project_code,
        ph.phase_name,
        m.milestone_name,
        parent.task_name as parent_task_name,
        -- Time tracking
        (SELECT SUM(hours_worked) FROM project_time_entries WHERE task_id = t.task_id) as total_hours_logged,
        (SELECT COUNT(*) FROM project_time_entries WHERE task_id = t.task_id) as time_entry_count,
        -- Dependencies
        (SELECT COUNT(*) FROM project_task_dependencies WHERE task_id = t.task_id) as depends_on_count,
        (SELECT COUNT(*) FROM project_task_dependencies WHERE depends_on_task_id = t.task_id) as blocked_by_count,
        -- Comments
        (SELECT COUNT(*) FROM project_task_comments WHERE task_id = t.task_id AND is_deleted = FALSE) as comment_count
      FROM project_tasks t
      JOIN projects p ON t.project_id = p.project_id
      LEFT JOIN project_phases ph ON t.phase_id = ph.phase_id
      LEFT JOIN project_milestones m ON t.milestone_id = m.milestone_id
      LEFT JOIN project_tasks parent ON t.parent_task_id = parent.task_id
      WHERE t.task_id = $1`,
      [taskId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const task = result.rows[0];

    // Get dependencies
    const dependenciesResult = await query(
      `SELECT 
        d.*,
        t.task_name as depends_on_task_name,
        t.task_status as depends_on_task_status,
        t.completion_percentage as depends_on_completion_percentage
       FROM project_task_dependencies d
       JOIN project_tasks t ON d.depends_on_task_id = t.task_id
       WHERE d.task_id = $1`,
      [taskId]
    );

    // Get tasks that depend on this task
    const blockingResult = await query(
      `SELECT 
        d.*,
        t.task_name as blocked_task_name,
        t.task_status as blocked_task_status
       FROM project_task_dependencies d
       JOIN project_tasks t ON d.task_id = t.task_id
       WHERE d.depends_on_task_id = $1`,
      [taskId]
    );

    // Get time entries
    const timeEntriesResult = await query(
      `SELECT * FROM project_time_entries 
       WHERE task_id = $1 
       ORDER BY entry_date DESC, created_at DESC
       LIMIT 20`,
      [taskId]
    );

    // Get comments
    const commentsResult = await query(
      `SELECT * FROM project_task_comments 
       WHERE task_id = $1 AND is_deleted = FALSE
       ORDER BY created_at DESC`,
      [taskId]
    );

    // Get subtasks
    const subtasksResult = await query(
      `SELECT task_id, task_name, task_status, completion_percentage, assigned_to
       FROM project_tasks 
       WHERE parent_task_id = $1 AND is_active = TRUE
       ORDER BY created_at`,
      [taskId]
    );

    return NextResponse.json({
      task,
      dependencies: dependenciesResult.rows,
      blocking_tasks: blockingResult.rows,
      time_entries: timeEntriesResult.rows,
      comments: commentsResult.rows,
      subtasks: subtasksResult.rows
    });

  } catch (error: any) {
    console.error('Error fetching task details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task details', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/projects/tasks/[id] - Update task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;
    const body = await request.json();

    // Check if task exists
    const existingTask = await query(
      'SELECT task_id, task_status FROM project_tasks WHERE task_id = $1',
      [taskId]
    );

    if (existingTask.rows.length === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const updatableFields = [
      'task_name', 'task_description', 'phase_id', 'milestone_id', 'parent_task_id',
      'assigned_to', 'assigned_by',
      'planned_start_date', 'planned_end_date', 'due_date',
      'actual_start_date', 'actual_end_date',
      'estimated_hours', 'remaining_hours',
      'task_status', 'status_reason', 'completion_percentage',
      'priority', 'task_type',
      'is_billable', 'billable_rate',
      'is_blocked', 'blocked_reason', 'blocked_date',
      'story_points', 'complexity',
      'checklist_items', 'tags', 'custom_fields',
      'is_active', 'updated_by'
    ];

    for (const field of updatableFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = $${paramIndex}`);
        values.push(body[field]);
        paramIndex++;
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // If task is being marked as completed, set completion date
    if (body.task_status === 'completed' && existingTask.rows[0].task_status !== 'completed') {
      updates.push(`completed_at = CURRENT_TIMESTAMP`);
      updates.push(`completion_percentage = 100`);
      if (body.completed_by) {
        updates.push(`completed_by = $${paramIndex}`);
        values.push(body.completed_by);
        paramIndex++;
      }
    }

    // If task is being unblocked
    if (body.is_blocked === false) {
      updates.push(`blocked_reason = NULL`);
      updates.push(`blocked_date = NULL`);
    }

    // If task is being blocked
    if (body.is_blocked === true && !body.blocked_date) {
      updates.push(`blocked_date = CURRENT_TIMESTAMP`);
    }

    // Add updated_at
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    const updateQuery = `
      UPDATE project_tasks 
      SET ${updates.join(', ')}
      WHERE task_id = $${paramIndex}
      RETURNING *
    `;

    values.push(taskId);
    const result = await query(updateQuery, values);

    return NextResponse.json({
      message: 'Task updated successfully',
      task: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/tasks/[id] - Delete task (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;

    // Check if task exists
    const existingTask = await query(
      'SELECT task_id FROM project_tasks WHERE task_id = $1',
      [taskId]
    );

    if (existingTask.rows.length === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Check if task has dependent tasks
    const dependentTasks = await query(
      'SELECT COUNT(*) as count FROM project_task_dependencies WHERE depends_on_task_id = $1',
      [taskId]
    );

    if (parseInt(dependentTasks.rows[0].count) > 0) {
      return NextResponse.json(
        { error: 'Cannot delete task that other tasks depend on. Please remove dependencies first.' },
        { status: 400 }
      );
    }

    // Soft delete by setting is_active = false
    await query(
      `UPDATE project_tasks 
       SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP 
       WHERE task_id = $1`,
      [taskId]
    );

    return NextResponse.json({
      message: 'Task deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task', details: error.message },
      { status: 500 }
    );
  }
}
