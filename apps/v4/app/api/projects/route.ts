import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/projects - List all projects with filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const project_status = searchParams.get('project_status');
    const health_status = searchParams.get('health_status');
    const project_type = searchParams.get('project_type');
    const project_manager_id = searchParams.get('project_manager_id');
    const customer_id = searchParams.get('customer_id');
    const search = searchParams.get('search');
    const is_active = searchParams.get('is_active');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let conditions: string[] = [];
    let params: any[] = [];
    let paramIndex = 1;

    if (project_status) {
      conditions.push(`project_status = $${paramIndex++}`);
      params.push(project_status);
    }

    if (health_status) {
      conditions.push(`health_status = $${paramIndex++}`);
      params.push(health_status);
    }

    if (project_type) {
      conditions.push(`project_type = $${paramIndex++}`);
      params.push(project_type);
    }

    if (project_manager_id) {
      conditions.push(`project_manager_id = $${paramIndex++}`);
      params.push(project_manager_id);
    }

    if (customer_id) {
      conditions.push(`customer_id = $${paramIndex++}`);
      params.push(customer_id);
    }

    if (search) {
      conditions.push(`(project_name ILIKE $${paramIndex} OR project_code ILIKE $${paramIndex} OR project_description ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (is_active !== null && is_active !== undefined) {
      conditions.push(`is_active = $${paramIndex++}`);
      params.push(is_active === 'true');
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM projects ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Get projects
    const projectsQuery = `
      SELECT 
        p.*,
        -- Calculate days until deadline
        CASE 
          WHEN p.planned_end_date >= CURRENT_DATE 
          THEN (p.planned_end_date - CURRENT_DATE)
          ELSE 0
        END as days_until_deadline,
        -- Calculate if overdue
        CASE 
          WHEN p.planned_end_date < CURRENT_DATE AND p.project_status != 'completed' 
          THEN TRUE 
          ELSE FALSE 
        END as is_overdue,
        -- Task statistics
        (SELECT COUNT(*) FROM project_tasks WHERE project_id = p.project_id AND is_active = TRUE) as total_tasks,
        (SELECT COUNT(*) FROM project_tasks WHERE project_id = p.project_id AND task_status = 'completed') as completed_tasks,
        (SELECT COUNT(*) FROM project_tasks WHERE project_id = p.project_id AND task_status = 'in_progress') as in_progress_tasks,
        -- Team size
        (SELECT COUNT(*) FROM project_team_members WHERE project_id = p.project_id AND is_active = TRUE) as team_members_count,
        -- Milestone progress
        (SELECT COUNT(*) FROM project_milestones WHERE project_id = p.project_id) as total_milestones,
        (SELECT COUNT(*) FROM project_milestones WHERE project_id = p.project_id AND milestone_status = 'achieved') as achieved_milestones
      FROM projects p
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);
    const result = await query(projectsQuery, params);

    // Calculate statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_projects,
        COUNT(*) FILTER (WHERE project_status = 'active') as active_projects,
        COUNT(*) FILTER (WHERE project_status = 'completed') as completed_projects,
        COUNT(*) FILTER (WHERE project_status = 'planning') as planning_projects,
        COUNT(*) FILTER (WHERE health_status = 'on_track') as on_track_projects,
        COUNT(*) FILTER (WHERE health_status = 'at_risk') as at_risk_projects,
        COUNT(*) FILTER (WHERE health_status = 'delayed') as delayed_projects,
        SUM(budget_amount) as total_budget,
        SUM(actual_cost) as total_actual_cost,
        AVG(completion_percentage) as avg_completion_percentage
      FROM projects
      ${whereClause}
    `;

    const statsResult = await query(statsQuery, conditions.length > 0 ? params.slice(0, -2) : []);

    return NextResponse.json({
      projects: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      statistics: statsResult.rows[0]
    });

  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      project_code,
      project_name,
      project_description,
      customer_id,
      customer_name,
      project_type,
      project_category,
      industry,
      project_manager_id,
      project_manager_name,
      planned_start_date,
      planned_end_date,
      project_status = 'planning',
      health_status = 'on_track',
      priority = 'medium',
      risk_level = 'low',
      budget_amount = 0,
      budget_currency = 'USD',
      billing_type = 'fixed_price',
      billing_rate_per_hour,
      project_location,
      site_address,
      enable_notifications = true,
      tags = [],
      custom_fields = {},
      is_billable = true,
      created_by
    } = body;

    // Validation
    if (!project_code || !project_name || !planned_start_date || !planned_end_date) {
      return NextResponse.json(
        { error: 'Missing required fields: project_code, project_name, planned_start_date, planned_end_date' },
        { status: 400 }
      );
    }

    // Check for duplicate project code
    const existingProject = await query(
      'SELECT project_id FROM projects WHERE project_code = $1',
      [project_code]
    );

    if (existingProject.rows.length > 0) {
      return NextResponse.json(
        { error: 'Project code already exists' },
        { status: 409 }
      );
    }

    const insertQuery = `
      INSERT INTO projects (
        project_code, project_name, project_description,
        customer_id, customer_name,
        project_type, project_category, industry,
        project_manager_id, project_manager_name,
        planned_start_date, planned_end_date,
        project_status, health_status, priority, risk_level,
        budget_amount, budget_currency,
        billing_type, billing_rate_per_hour,
        project_location, site_address,
        enable_notifications, tags, custom_fields,
        is_billable, created_by, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, CURRENT_TIMESTAMP
      )
      RETURNING *
    `;

    const result = await query(insertQuery, [
      project_code, project_name, project_description,
      customer_id, customer_name,
      project_type, project_category, industry,
      project_manager_id, project_manager_name,
      planned_start_date, planned_end_date,
      project_status, health_status, priority, risk_level,
      budget_amount, budget_currency,
      billing_type, billing_rate_per_hour,
      project_location, site_address,
      enable_notifications, tags, custom_fields,
      is_billable, created_by
    ]);

    return NextResponse.json({
      message: 'Project created successfully',
      project: result.rows[0]
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project', details: error.message },
      { status: 500 }
    );
  }
}
