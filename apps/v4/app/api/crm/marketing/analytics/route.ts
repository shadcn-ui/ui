import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

/**
 * GET /api/crm/marketing/analytics
 * Comprehensive marketing analytics and metrics
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const campaignId = searchParams.get('campaign_id');
    const days = parseInt(searchParams.get('days') || '30');
    const groupBy = searchParams.get('group_by') || 'day'; // day, week, month

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let whereConditions = ['c.is_active = true'];
    const values: any[] = [];
    let valueIndex = 1;

    if (campaignId) {
      whereConditions.push(`c.campaign_id = $${valueIndex}`);
      values.push(parseInt(campaignId));
      valueIndex++;
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Overall campaign metrics
    const overallQuery = `
      SELECT 
        COUNT(*) as total_campaigns,
        COUNT(*) FILTER (WHERE status = 'active') as active_campaigns,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_campaigns,
        SUM(total_members) as total_members,
        SUM(total_sent) as total_emails_sent,
        SUM(total_delivered) as total_delivered,
        SUM(total_opened) as total_opened,
        SUM(total_clicked) as total_clicked,
        SUM(leads_generated) as total_leads,
        SUM(opportunities_generated) as total_opportunities,
        SUM(revenue_generated) as total_revenue,
        SUM(budget_amount) as total_budget,
        SUM(actual_cost) as total_cost,
        CASE 
          WHEN SUM(total_sent) > 0 THEN ROUND((SUM(total_delivered)::numeric / SUM(total_sent) * 100), 2)
          ELSE 0
        END as avg_delivery_rate,
        CASE 
          WHEN SUM(total_delivered) > 0 THEN ROUND((SUM(total_opened)::numeric / SUM(total_delivered) * 100), 2)
          ELSE 0
        END as avg_open_rate,
        CASE 
          WHEN SUM(total_opened) > 0 THEN ROUND((SUM(total_clicked)::numeric / SUM(total_opened) * 100), 2)
          ELSE 0
        END as avg_ctr,
        CASE 
          WHEN SUM(total_members) > 0 THEN ROUND((SUM(leads_generated)::numeric / SUM(total_members) * 100), 2)
          ELSE 0
        END as avg_conversion_rate,
        CASE 
          WHEN SUM(actual_cost) > 0 THEN ROUND((SUM(revenue_generated) / SUM(actual_cost)), 2)
          ELSE 0
        END as overall_roi
      FROM crm_campaigns c
      ${whereClause}
    `;
    const overallResult = await pool.query(overallQuery, values);

    // Campaign performance by type
    const byTypeQuery = `
      SELECT 
        ct.type_name,
        ct.icon,
        ct.color,
        COUNT(c.campaign_id) as campaign_count,
        SUM(c.total_members) as total_members,
        SUM(c.total_sent) as total_sent,
        SUM(c.total_opened) as total_opened,
        SUM(c.total_clicked) as total_clicked,
        SUM(c.leads_generated) as leads_generated,
        SUM(c.revenue_generated) as revenue_generated,
        CASE 
          WHEN SUM(c.total_delivered) > 0 THEN ROUND((SUM(c.total_opened)::numeric / SUM(c.total_delivered) * 100), 2)
          ELSE 0
        END as avg_open_rate,
        CASE 
          WHEN SUM(c.actual_cost) > 0 THEN ROUND((SUM(c.revenue_generated) / SUM(c.actual_cost)), 2)
          ELSE 0
        END as roi
      FROM crm_campaigns c
      JOIN crm_campaign_types ct ON c.campaign_type_id = ct.campaign_type_id
      ${whereClause}
      GROUP BY ct.campaign_type_id, ct.type_name, ct.icon, ct.color
      ORDER BY revenue_generated DESC
    `;
    const byTypeResult = await pool.query(byTypeQuery, values);

    // Top performing campaigns
    const topCampaignsQuery = `
      SELECT 
        c.campaign_id,
        c.campaign_number,
        c.campaign_name,
        ct.type_name as campaign_type,
        c.status,
        c.total_members,
        c.total_sent,
        c.total_opened,
        c.total_clicked,
        c.leads_generated,
        c.revenue_generated,
        c.actual_cost,
        CASE 
          WHEN c.total_delivered > 0 THEN ROUND((c.total_opened::numeric / c.total_delivered * 100), 2)
          ELSE 0
        END as open_rate,
        CASE 
          WHEN c.actual_cost > 0 THEN ROUND((c.revenue_generated / c.actual_cost), 2)
          ELSE 0
        END as roi
      FROM crm_campaigns c
      JOIN crm_campaign_types ct ON c.campaign_type_id = ct.campaign_type_id
      ${whereClause}
      ORDER BY c.revenue_generated DESC
      LIMIT 10
    `;
    const topCampaignsResult = await pool.query(topCampaignsQuery, values);

    // Engagement trends (last 30 days)
    const dateFormat = groupBy === 'month' ? 'YYYY-MM' : groupBy === 'week' ? 'IYYY-IW' : 'YYYY-MM-DD';
    const trendQuery = `
      SELECT 
        TO_CHAR(analytics_date, '${dateFormat}') as period,
        SUM(emails_sent) as emails_sent,
        SUM(emails_delivered) as emails_delivered,
        SUM(emails_opened) as emails_opened,
        SUM(emails_clicked) as emails_clicked,
        SUM(leads_generated) as leads_generated,
        SUM(revenue_for_day) as revenue,
        CASE 
          WHEN SUM(emails_delivered) > 0 THEN ROUND((SUM(emails_opened)::numeric / SUM(emails_delivered) * 100), 2)
          ELSE 0
        END as open_rate,
        CASE 
          WHEN SUM(emails_opened) > 0 THEN ROUND((SUM(emails_clicked)::numeric / SUM(emails_opened) * 100), 2)
          ELSE 0
        END as ctr
      FROM crm_campaign_analytics ca
      JOIN crm_campaigns c ON ca.campaign_id = c.campaign_id
      WHERE ca.analytics_date >= $${valueIndex} ${campaignId ? 'AND c.campaign_id = $1' : ''}
      GROUP BY TO_CHAR(analytics_date, '${dateFormat}')
      ORDER BY period ASC
    `;
    values.push(startDate);
    const trendResult = await pool.query(trendQuery, values);

    // Email template performance
    const templatePerformanceQuery = `
      SELECT 
        t.template_id,
        t.template_name,
        t.category,
        t.sent_count,
        t.open_count,
        t.click_count,
        CASE 
          WHEN t.sent_count > 0 THEN ROUND((t.open_count::numeric / t.sent_count * 100), 2)
          ELSE 0
        END as open_rate,
        CASE 
          WHEN t.open_count > 0 THEN ROUND((t.click_count::numeric / t.open_count * 100), 2)
          ELSE 0
        END as ctr
      FROM crm_email_templates t
      WHERE t.is_active = true AND t.sent_count > 0
      ORDER BY t.open_count DESC
      LIMIT 10
    `;
    const templatePerformanceResult = await pool.query(templatePerformanceQuery);

    // Lead scoring distribution
    const leadScoreQuery = `
      SELECT 
        CASE 
          WHEN lead_score >= 80 THEN 'Hot (80+)'
          WHEN lead_score >= 60 THEN 'Warm (60-79)'
          WHEN lead_score >= 40 THEN 'Moderate (40-59)'
          WHEN lead_score >= 20 THEN 'Cold (20-39)'
          ELSE 'Very Cold (0-19)'
        END as score_range,
        COUNT(*) as count,
        ROUND(AVG(lead_score), 1) as avg_score
      FROM crm_contacts
      WHERE is_active = true AND lead_score IS NOT NULL
      GROUP BY 
        CASE 
          WHEN lead_score >= 80 THEN 'Hot (80+)'
          WHEN lead_score >= 60 THEN 'Warm (60-79)'
          WHEN lead_score >= 40 THEN 'Moderate (40-59)'
          WHEN lead_score >= 20 THEN 'Cold (20-39)'
          ELSE 'Very Cold (0-19)'
        END
      ORDER BY MIN(lead_score) DESC
    `;
    const leadScoreResult = await pool.query(leadScoreQuery);

    // Campaign member status distribution
    const memberStatusQuery = `
      SELECT 
        cm.member_status,
        COUNT(*) as count
      FROM crm_campaign_members cm
      JOIN crm_campaigns c ON cm.campaign_id = c.campaign_id
      ${whereClause}
      GROUP BY cm.member_status
      ORDER BY count DESC
    `;
    const memberStatusResult = await pool.query(memberStatusQuery, values.slice(0, -1));

    // Recent high-value conversions
    const conversionsQuery = `
      SELECT 
        cm.member_id,
        con.full_name,
        con.email,
        a.account_name,
        c.campaign_name,
        cm.converted_at,
        cm.conversion_type,
        cm.revenue_attributed,
        o.opportunity_name,
        o.amount as opportunity_amount
      FROM crm_campaign_members cm
      JOIN crm_contacts con ON cm.contact_id = con.contact_id
      LEFT JOIN crm_accounts a ON cm.account_id = a.account_id
      JOIN crm_campaigns c ON cm.campaign_id = c.campaign_id
      LEFT JOIN crm_opportunities o ON cm.opportunity_id = o.opportunity_id
      WHERE cm.converted_at IS NOT NULL
      ORDER BY cm.converted_at DESC
      LIMIT 10
    `;
    const conversionsResult = await pool.query(conversionsQuery);

    return NextResponse.json({
      overall: overallResult.rows[0],
      by_campaign_type: byTypeResult.rows,
      top_campaigns: topCampaignsResult.rows,
      engagement_trend: trendResult.rows,
      template_performance: templatePerformanceResult.rows,
      lead_score_distribution: leadScoreResult.rows,
      member_status_distribution: memberStatusResult.rows,
      recent_conversions: conversionsResult.rows,
      period: {
        days,
        start_date: startDate,
        end_date: new Date(),
      },
    });
  } catch (error) {
    console.error('Error fetching marketing analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marketing analytics' },
      { status: 500 }
    );
  }
}
