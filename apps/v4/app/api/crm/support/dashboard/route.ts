import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

/**
 * GET /api/crm/support/dashboard
 * Get support team dashboard metrics
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ownerId = searchParams.get('owner_id');
    const teamId = searchParams.get('team_id');
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let whereConditions = ['c.is_active = true'];
    let timeConditions = [`c.created_at >= $1`];
    const values: any[] = [startDate];
    let valueIndex = 2;

    if (ownerId) {
      whereConditions.push(`c.owner_id = $${valueIndex}`);
      values.push(parseInt(ownerId));
      valueIndex++;
    }

    if (teamId) {
      whereConditions.push(`c.team_id = $${valueIndex}`);
      values.push(parseInt(teamId));
      valueIndex++;
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';
    const timeWhereClause = (whereConditions.length > 0 ? whereConditions.join(' AND ') + ' AND ' : '') + timeConditions.join(' AND ');

    // Overall statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_cases,
        COUNT(*) FILTER (WHERE status = 'new') as new_cases,
        COUNT(*) FILTER (WHERE status = 'open') as open_cases,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_cases,
        COUNT(*) FILTER (WHERE status = 'waiting_customer') as waiting_customer_cases,
        COUNT(*) FILTER (WHERE status = 'resolved') as resolved_cases,
        COUNT(*) FILTER (WHERE status = 'closed') as closed_cases,
        COUNT(*) FILTER (WHERE is_escalated = true AND status NOT IN ('resolved', 'closed')) as escalated_cases,
        COUNT(*) FILTER (
          WHERE (first_response_at IS NULL AND CURRENT_TIMESTAMP > first_response_due) OR
                (resolved_at IS NULL AND status NOT IN ('resolved', 'closed') AND CURRENT_TIMESTAMP > resolution_due)
        ) as sla_violated_cases,
        COUNT(*) FILTER (WHERE reopened_count > 0) as reopened_cases,
        AVG(CASE WHEN response_time_minutes IS NOT NULL THEN response_time_minutes END) as avg_response_time_minutes,
        AVG(CASE WHEN resolution_time_minutes IS NOT NULL THEN resolution_time_minutes END) as avg_resolution_time_minutes,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY response_time_minutes) as median_response_time_minutes,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY resolution_time_minutes) as median_resolution_time_minutes,
        AVG(csat_score) as avg_csat_score,
        COUNT(*) FILTER (WHERE csat_score IS NOT NULL) as csat_response_count
      FROM crm_cases c
      ${whereClause}
    `;

    const statsResult = await pool.query(statsQuery, values.slice(1));

    // Period statistics (last N days)
    const periodStatsQuery = `
      SELECT 
        COUNT(*) as period_total,
        COUNT(*) FILTER (WHERE status IN ('resolved', 'closed')) as period_resolved,
        AVG(CASE WHEN response_time_minutes IS NOT NULL THEN response_time_minutes END) as period_avg_response,
        AVG(CASE WHEN resolution_time_minutes IS NOT NULL THEN resolution_time_minutes END) as period_avg_resolution
      FROM crm_cases c
      WHERE ${timeWhereClause}
    `;

    const periodStatsResult = await pool.query(periodStatsQuery, values);

    // By priority breakdown
    const priorityQuery = `
      SELECT 
        cp.priority_name,
        cp.priority_level,
        cp.color,
        COUNT(*) as case_count,
        COUNT(*) FILTER (WHERE c.status NOT IN ('resolved', 'closed')) as open_count,
        AVG(CASE WHEN c.response_time_minutes IS NOT NULL THEN c.response_time_minutes END) as avg_response_time,
        AVG(CASE WHEN c.resolution_time_minutes IS NOT NULL THEN c.resolution_time_minutes END) as avg_resolution_time
      FROM crm_cases c
      JOIN crm_case_priorities cp ON c.priority_id = cp.priority_id
      WHERE ${timeWhereClause}
      GROUP BY cp.priority_id, cp.priority_name, cp.priority_level, cp.color
      ORDER BY cp.priority_level DESC
    `;

    const priorityResult = await pool.query(priorityQuery, values);

    // By type breakdown
    const typeQuery = `
      SELECT 
        ct.type_name,
        ct.icon,
        ct.color,
        COUNT(*) as case_count,
        COUNT(*) FILTER (WHERE c.status NOT IN ('resolved', 'closed')) as open_count,
        AVG(CASE WHEN c.resolution_time_minutes IS NOT NULL THEN c.resolution_time_minutes END) as avg_resolution_time
      FROM crm_cases c
      JOIN crm_case_types ct ON c.case_type_id = ct.case_type_id
      WHERE ${timeWhereClause}
      GROUP BY ct.case_type_id, ct.type_name, ct.icon, ct.color
      ORDER BY case_count DESC
    `;

    const typeResult = await pool.query(typeQuery, values);

    // By channel breakdown
    const channelQuery = `
      SELECT 
        channel,
        COUNT(*) as case_count,
        AVG(CASE WHEN response_time_minutes IS NOT NULL THEN response_time_minutes END) as avg_response_time
      FROM crm_cases c
      WHERE ${timeWhereClause} AND channel IS NOT NULL
      GROUP BY channel
      ORDER BY case_count DESC
    `;

    const channelResult = await pool.query(channelQuery, values);

    // Daily trend (last 30 days)
    const trendQuery = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as cases_created,
        COUNT(*) FILTER (WHERE status IN ('resolved', 'closed')) as cases_resolved,
        AVG(CASE WHEN response_time_minutes IS NOT NULL THEN response_time_minutes END) as avg_response_time
      FROM crm_cases c
      WHERE ${timeWhereClause}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    const trendResult = await pool.query(trendQuery, values);

    // Top SLA violations
    const slaViolationsQuery = `
      SELECT 
        c.case_id,
        c.case_number,
        c.subject,
        c.status,
        a.account_name,
        cp.priority_name,
        COUNT(sv.violation_id) as violation_count,
        MAX(sv.minutes_overdue) as max_minutes_overdue
      FROM crm_cases c
      JOIN crm_accounts a ON c.account_id = a.account_id
      JOIN crm_case_priorities cp ON c.priority_id = cp.priority_id
      JOIN crm_sla_violations sv ON c.case_id = sv.case_id
      ${whereClause}
      GROUP BY c.case_id, c.case_number, c.subject, c.status, a.account_name, cp.priority_name
      ORDER BY violation_count DESC, max_minutes_overdue DESC
      LIMIT 10
    `;

    const slaViolationsResult = await pool.query(slaViolationsQuery, values.slice(1));

    // Cases needing attention (high priority, no response, or overdue)
    const attentionQuery = `
      SELECT 
        c.case_id,
        c.case_number,
        c.subject,
        c.status,
        a.account_name,
        cp.priority_name,
        cp.priority_level,
        c.created_at,
        c.first_response_due,
        c.resolution_due,
        CASE 
          WHEN c.first_response_at IS NULL AND CURRENT_TIMESTAMP > c.first_response_due THEN 'First response overdue'
          WHEN c.resolved_at IS NULL AND CURRENT_TIMESTAMP > c.resolution_due THEN 'Resolution overdue'
          WHEN c.first_response_at IS NULL AND cp.priority_level >= 3 THEN 'High priority awaiting response'
          ELSE 'Needs attention'
        END as attention_reason
      FROM crm_cases c
      JOIN crm_accounts a ON c.account_id = a.account_id
      JOIN crm_case_priorities cp ON c.priority_id = cp.priority_id
      ${whereClause.replace('WHERE', 'WHERE') + ' AND c.status NOT IN (\'resolved\', \'closed\') AND ('}
        (c.first_response_at IS NULL AND CURRENT_TIMESTAMP > c.first_response_due) OR
        (c.resolved_at IS NULL AND CURRENT_TIMESTAMP > c.resolution_due) OR
        (c.first_response_at IS NULL AND cp.priority_level >= 3)
      )
      ORDER BY cp.priority_level DESC, c.created_at ASC
      LIMIT 20
    `;

    const attentionResult = await pool.query(attentionQuery, values.slice(1));

    // Recent customer satisfaction
    const csatQuery = `
      SELECT 
        c.case_id,
        c.case_number,
        c.subject,
        a.account_name,
        c.csat_score,
        c.csat_comment,
        c.csat_submitted_at
      FROM crm_cases c
      JOIN crm_accounts a ON c.account_id = a.account_id
      ${whereClause.replace('WHERE', 'WHERE') + ' AND c.csat_score IS NOT NULL'}
      ORDER BY c.csat_submitted_at DESC
      LIMIT 10
    `;

    const csatResult = await pool.query(csatQuery, values.slice(1));

    return NextResponse.json({
      overall: statsResult.rows[0],
      period: {
        days,
        ...periodStatsResult.rows[0],
      },
      by_priority: priorityResult.rows,
      by_type: typeResult.rows,
      by_channel: channelResult.rows,
      daily_trend: trendResult.rows,
      sla_violations: slaViolationsResult.rows,
      needs_attention: attentionResult.rows,
      recent_csat: csatResult.rows,
    });
  } catch (error) {
    console.error('Error fetching support dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch support dashboard' },
      { status: 500 }
    );
  }
}
