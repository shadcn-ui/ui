import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/projects/analytics - Get project analytics and dashboard data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const project_id = searchParams.get('project_id');
    const from_date = searchParams.get('from_date');
    const to_date = searchParams.get('to_date');
    const report_type = searchParams.get('type') || 'dashboard';

    // If specific project, get project dashboard
    if (project_id) {
      return await getProjectDashboard(project_id);
    }

    // Otherwise, get overall portfolio analytics
    switch (report_type) {
      case 'dashboard':
        return await getPortfolioDashboard(from_date, to_date);
      case 'financial':
        return await getFinancialAnalytics(from_date, to_date);
      case 'resources':
        return await getResourceAnalytics();
      case 'timeline':
        return await getTimelineAnalytics();
      default:
        return await getPortfolioDashboard(from_date, to_date);
    }

  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: error.message },
      { status: 500 }
    );
  }
}

// Portfolio dashboard
async function getPortfolioDashboard(from_date?: string | null, to_date?: string | null) {
  // Overall project statistics
  const projectStats = await query(
    `SELECT 
      COUNT(*) as total_projects,
      COUNT(*) FILTER (WHERE project_status = 'active') as active_projects,
      COUNT(*) FILTER (WHERE project_status = 'completed') as completed_projects,
      COUNT(*) FILTER (WHERE project_status = 'planning') as planning_projects,
      COUNT(*) FILTER (WHERE project_status = 'on_hold') as on_hold_projects,
      COUNT(*) FILTER (WHERE health_status = 'on_track') as on_track_count,
      COUNT(*) FILTER (WHERE health_status = 'at_risk') as at_risk_count,
      COUNT(*) FILTER (WHERE health_status = 'delayed') as delayed_count,
      COUNT(*) FILTER (WHERE health_status = 'critical') as critical_count,
      AVG(completion_percentage) as avg_completion_percentage,
      SUM(budget_amount) as total_budget,
      SUM(actual_cost) as total_actual_cost,
      SUM(budget_variance) as total_variance,
      SUM(total_hours_logged) as total_hours_logged,
      SUM(billable_hours) as total_billable_hours
    FROM projects
    WHERE is_active = TRUE`
  );

  // Task statistics
  const taskStats = await query(
    `SELECT 
      COUNT(*) as total_tasks,
      COUNT(*) FILTER (WHERE task_status = 'completed') as completed_tasks,
      COUNT(*) FILTER (WHERE task_status = 'in_progress') as in_progress_tasks,
      COUNT(*) FILTER (WHERE task_status = 'blocked') as blocked_tasks,
      COUNT(*) FILTER (WHERE is_blocked = TRUE) as total_blocked_tasks,
      COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND task_status NOT IN ('completed', 'cancelled')) as overdue_tasks,
      AVG(completion_percentage) as avg_task_completion
    FROM project_tasks
    WHERE is_active = TRUE`
  );

  // Recent activities
  const recentActivities = await query(
    `SELECT 
      'time_entry' as activity_type,
      te.time_entry_id as id,
      p.project_name,
      te.work_description as description,
      te.hours_worked as value,
      te.created_at
    FROM project_time_entries te
    JOIN projects p ON te.project_id = p.project_id
    ORDER BY te.created_at DESC
    LIMIT 10`
  );

  // Projects by status
  const projectsByStatus = await query(
    `SELECT 
      project_status,
      COUNT(*) as count,
      SUM(budget_amount) as total_budget,
      AVG(completion_percentage) as avg_completion
    FROM projects
    WHERE is_active = TRUE
    GROUP BY project_status`
  );

  // Projects by health
  const projectsByHealth = await query(
    `SELECT 
      health_status,
      COUNT(*) as count
    FROM projects
    WHERE is_active = TRUE AND project_status = 'active'
    GROUP BY health_status`
  );

  // Top projects by budget
  const topProjects = await query(
    `SELECT 
      project_id,
      project_code,
      project_name,
      budget_amount,
      actual_cost,
      budget_variance,
      completion_percentage,
      project_status,
      health_status
    FROM projects
    WHERE is_active = TRUE
    ORDER BY budget_amount DESC
    LIMIT 10`
  );

  // Milestones summary
  const milestonesStats = await query(
    `SELECT 
      COUNT(*) as total_milestones,
      COUNT(*) FILTER (WHERE milestone_status = 'achieved') as achieved_milestones,
      COUNT(*) FILTER (WHERE milestone_status = 'pending' AND planned_date < CURRENT_DATE) as overdue_milestones
    FROM project_milestones
    WHERE is_active = TRUE`
  );

  return NextResponse.json({
    summary: {
      ...projectStats.rows[0],
      ...taskStats.rows[0],
      ...milestonesStats.rows[0]
    },
    projects_by_status: projectsByStatus.rows,
    projects_by_health: projectsByHealth.rows,
    top_projects: topProjects.rows,
    recent_activities: recentActivities.rows
  });
}

// Financial analytics
async function getFinancialAnalytics(from_date?: string | null, to_date?: string | null) {
  let dateCondition = '';
  let params: any[] = [];

  if (from_date && to_date) {
    dateCondition = 'AND created_at BETWEEN $1 AND $2';
    params = [from_date, to_date];
  }

  const financialSummary = await query(
    `SELECT 
      SUM(budget_amount) as total_budget,
      SUM(actual_cost) as total_cost,
      SUM(budget_variance) as total_variance,
      SUM(total_billed_amount) as total_billed,
      SUM(total_unbilled_amount) as total_unbilled,
      COUNT(*) FILTER (WHERE actual_cost > budget_amount) as over_budget_count
    FROM projects
    WHERE is_active = TRUE ${dateCondition}`,
    params
  );

  // Budget by category
  const budgetByCategory = await query(
    `SELECT 
      budget_category,
      SUM(budgeted_amount) as budgeted,
      SUM(actual_amount) as actual,
      SUM(variance_amount) as variance
    FROM project_budgets
    WHERE is_active = TRUE
    GROUP BY budget_category
    ORDER BY budgeted DESC`
  );

  // Expenses by category
  const expensesByCategory = await query(
    `SELECT 
      expense_category,
      COUNT(*) as count,
      SUM(expense_amount) as total_amount,
      SUM(CASE WHEN expense_status = 'approved' THEN expense_amount ELSE 0 END) as approved_amount
    FROM project_expenses
    GROUP BY expense_category
    ORDER BY total_amount DESC`
  );

  // Revenue analysis
  const revenueAnalysis = await query(
    `SELECT 
      SUM(billable_amount) as total_revenue,
      SUM(CASE WHEN is_invoiced = TRUE THEN billable_amount ELSE 0 END) as invoiced_revenue,
      SUM(CASE WHEN is_invoiced = FALSE THEN billable_amount ELSE 0 END) as unbilled_revenue,
      AVG(billing_rate) as avg_billing_rate
    FROM project_time_entries
    WHERE is_billable = TRUE`
  );

  return NextResponse.json({
    financial_summary: financialSummary.rows[0],
    budget_by_category: budgetByCategory.rows,
    expenses_by_category: expensesByCategory.rows,
    revenue_analysis: revenueAnalysis.rows[0]
  });
}

// Resource analytics
async function getResourceAnalytics() {
  const resourceUtilization = await query(
    `SELECT * FROM project_resource_utilization
     ORDER BY weekly_utilization_percentage DESC`
  );

  const topPerformers = await query(
    `SELECT 
      user_id,
      COUNT(DISTINCT project_id) as project_count,
      SUM(hours_worked) as total_hours,
      SUM(billable_amount) as total_revenue,
      AVG(hours_worked) as avg_hours_per_entry
    FROM project_time_entries
    WHERE entry_date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY user_id
    ORDER BY total_revenue DESC
    LIMIT 10`
  );

  const teamDistribution = await query(
    `SELECT 
      role,
      COUNT(*) as count,
      AVG(hourly_rate) as avg_hourly_rate,
      AVG(billing_rate) as avg_billing_rate
    FROM project_team_members
    WHERE is_active = TRUE AND member_status = 'active'
    GROUP BY role
    ORDER BY count DESC`
  );

  return NextResponse.json({
    resource_utilization: resourceUtilization.rows,
    top_performers: topPerformers.rows,
    team_distribution: teamDistribution.rows
  });
}

// Timeline analytics
async function getTimelineAnalytics() {
  const upcomingDeadlines = await query(
    `SELECT 
      project_id,
      project_name,
      planned_end_date,
      completion_percentage,
      health_status,
      (planned_end_date - CURRENT_DATE) as days_remaining
    FROM projects
    WHERE is_active = TRUE 
      AND project_status = 'active'
      AND planned_end_date >= CURRENT_DATE
    ORDER BY planned_end_date
    LIMIT 20`
  );

  const overdueProjects = await query(
    `SELECT 
      project_id,
      project_name,
      planned_end_date,
      completion_percentage,
      (CURRENT_DATE - planned_end_date) as days_overdue
    FROM projects
    WHERE is_active = TRUE 
      AND project_status != 'completed'
      AND planned_end_date < CURRENT_DATE
    ORDER BY days_overdue DESC`
  );

  const upcomingMilestones = await query(
    `SELECT 
      m.milestone_id,
      m.milestone_name,
      m.planned_date,
      m.milestone_type,
      p.project_name,
      (m.planned_date - CURRENT_DATE) as days_until
    FROM project_milestones m
    JOIN projects p ON m.project_id = p.project_id
    WHERE m.milestone_status = 'pending'
      AND m.planned_date >= CURRENT_DATE
    ORDER BY m.planned_date
    LIMIT 20`
  );

  return NextResponse.json({
    upcoming_deadlines: upcomingDeadlines.rows,
    overdue_projects: overdueProjects.rows,
    upcoming_milestones: upcomingMilestones.rows
  });
}

// Single project dashboard
async function getProjectDashboard(project_id: string) {
  const projectDetails = await query(
    `SELECT * FROM project_dashboard_summary WHERE project_id = $1`,
    [project_id]
  );

  if (projectDetails.rows.length === 0) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const timelineData = await query(
    `SELECT * FROM project_task_timeline WHERE project_id = $1`,
    [project_id]
  );

  const budgetBreakdown = await query(
    `SELECT * FROM project_budgets WHERE project_id = $1 AND is_active = TRUE`,
    [project_id]
  );

  const teamMembers = await query(
    `SELECT * FROM project_team_members WHERE project_id = $1 AND is_active = TRUE`,
    [project_id]
  );

  const recentTime = await query(
    `SELECT * FROM project_time_entries 
     WHERE project_id = $1 
     ORDER BY entry_date DESC, created_at DESC 
     LIMIT 20`,
    [project_id]
  );

  return NextResponse.json({
    project: projectDetails.rows[0],
    timeline: timelineData.rows,
    budget_breakdown: budgetBreakdown.rows,
    team_members: teamMembers.rows,
    recent_time_entries: recentTime.rows
  });
}
