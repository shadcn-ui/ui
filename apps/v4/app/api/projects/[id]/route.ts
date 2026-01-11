import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/projects/[id] - Get project details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;

    const result = await query(
      `SELECT 
        p.*,
        -- Calculate progress metrics
        CASE 
          WHEN p.planned_end_date >= CURRENT_DATE 
          THEN (p.planned_end_date - CURRENT_DATE)
          ELSE 0
        END as days_until_deadline,
        CASE 
          WHEN p.planned_end_date < CURRENT_DATE AND p.project_status != 'completed' 
          THEN TRUE 
          ELSE FALSE 
        END as is_overdue,
        CASE 
          WHEN p.planned_start_date IS NOT NULL AND p.planned_end_date IS NOT NULL
          THEN ((CURRENT_DATE - p.planned_start_date)::FLOAT / NULLIF((p.planned_end_date - p.planned_start_date), 0) * 100)
          ELSE 0
        END as schedule_progress_percentage
      FROM projects p
      WHERE p.project_id = $1`,
      [projectId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const project = result.rows[0];

    // Get phases
    const phasesResult = await query(
      `SELECT * FROM project_phases 
       WHERE project_id = $1 
       ORDER BY phase_order`,
      [projectId]
    );

    // Get milestones
    const milestonesResult = await query(
      `SELECT * FROM project_milestones 
       WHERE project_id = $1 
       ORDER BY planned_date`,
      [projectId]
    );

    // Get tasks summary
    const tasksResult = await query(
      `SELECT 
        task_status,
        COUNT(*) as count,
        SUM(estimated_hours) as total_estimated_hours,
        SUM(actual_hours) as total_actual_hours
       FROM project_tasks 
       WHERE project_id = $1 AND is_active = TRUE
       GROUP BY task_status`,
      [projectId]
    );

    // Get team members
    const teamResult = await query(
      `SELECT * FROM project_team_members 
       WHERE project_id = $1 AND is_active = TRUE
       ORDER BY joined_date`,
      [projectId]
    );

    // Get budget breakdown
    const budgetResult = await query(
      `SELECT 
        budget_category,
        SUM(budgeted_amount) as budgeted_amount,
        SUM(actual_amount) as actual_amount,
        SUM(variance_amount) as variance_amount
       FROM project_budgets 
       WHERE project_id = $1 AND is_active = TRUE
       GROUP BY budget_category`,
      [projectId]
    );

    // Get recent activities (time entries)
    const recentActivitiesResult = await query(
      `SELECT 
        te.*,
        pt.task_name
       FROM project_time_entries te
       LEFT JOIN project_tasks pt ON te.task_id = pt.task_id
       WHERE te.project_id = $1
       ORDER BY te.entry_date DESC, te.created_at DESC
       LIMIT 10`,
      [projectId]
    );

    return NextResponse.json({
      project,
      phases: phasesResult.rows,
      milestones: milestonesResult.rows,
      tasks_summary: tasksResult.rows,
      team_members: teamResult.rows,
      budget_breakdown: budgetResult.rows,
      recent_activities: recentActivitiesResult.rows
    });

  } catch (error: any) {
    console.error('Error fetching project details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project details', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const body = await request.json();

    // Check if project exists
    const existingProject = await query(
      'SELECT project_id FROM projects WHERE project_id = $1',
      [projectId]
    );

    if (existingProject.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const updatableFields = [
      'project_name', 'project_description', 'customer_id', 'customer_name',
      'project_type', 'project_category', 'industry',
      'project_manager_id', 'project_manager_name',
      'planned_start_date', 'planned_end_date',
      'actual_start_date', 'actual_end_date',
      'project_status', 'status_reason', 'health_status',
      'completion_percentage', 'priority', 'risk_level', 'risk_description',
      'budget_amount', 'budget_currency', 'actual_cost',
      'billing_type', 'billing_rate_per_hour',
      'project_location', 'site_address',
      'repository_url', 'documentation_url',
      'enable_notifications', 'notification_frequency',
      'tags', 'custom_fields', 'is_active', 'is_billable',
      'updated_by'
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

    // Add updated_at
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    const updateQuery = `
      UPDATE projects 
      SET ${updates.join(', ')}
      WHERE project_id = $${paramIndex}
      RETURNING *
    `;

    values.push(projectId);
    const result = await query(updateQuery, values);

    return NextResponse.json({
      message: 'Project updated successfully',
      project: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete project (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;

    // Check if project exists
    const existingProject = await query(
      'SELECT project_id FROM projects WHERE project_id = $1',
      [projectId]
    );

    if (existingProject.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting is_active = false
    await query(
      `UPDATE projects 
       SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP 
       WHERE project_id = $1`,
      [projectId]
    );

    return NextResponse.json({
      message: 'Project deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project', details: error.message },
      { status: 500 }
    );
  }
}
