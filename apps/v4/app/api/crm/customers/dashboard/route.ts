// Phase 7 Task 1: CRM Dashboard API
// GET /api/crm/customers/dashboard

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://mac@localhost:5432/ocean-erp",
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "30"; // days
    const periodDays = parseInt(period);

    // 1. Customer Overview Statistics
    const overviewQuery = `
      SELECT 
        COUNT(*) as total_accounts,
        COUNT(CASE WHEN account_type = 'customer' THEN 1 END) as total_customers,
        COUNT(CASE WHEN account_type = 'prospect' THEN 1 END) as total_prospects,
        COUNT(CASE WHEN account_type = 'partner' THEN 1 END) as total_partners,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_accounts,
        COUNT(CASE WHEN rating = 'hot' THEN 1 END) as hot_accounts,
        COUNT(CASE WHEN rating = 'warm' THEN 1 END) as warm_accounts,
        COUNT(CASE WHEN rating = 'cold' THEN 1 END) as cold_accounts,
        AVG(annual_revenue) as avg_annual_revenue,
        SUM(lifetime_value) as total_lifetime_value
      FROM crm_accounts
      WHERE is_active = true
    `;

    const overviewResult = await pool.query(overviewQuery);

    // 2. Recent Activity
    const recentActivityQuery = `
      SELECT 
        COUNT(*) as total_communications,
        COUNT(CASE WHEN communication_date >= CURRENT_DATE - INTERVAL '${periodDays} days' THEN 1 END) as recent_communications,
        COUNT(CASE WHEN direction = 'inbound' THEN 1 END) as inbound_count,
        COUNT(CASE WHEN direction = 'outbound' THEN 1 END) as outbound_count,
        AVG(duration_minutes) as avg_duration
      FROM crm_communication_log
    `;

    const activityResult = await pool.query(recentActivityQuery);

    // 3. Contact Statistics
    const contactStatsQuery = `
      SELECT 
        COUNT(*) as total_contacts,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_contacts,
        COUNT(CASE WHEN is_primary_contact = true THEN 1 END) as primary_contacts,
        COUNT(CASE WHEN is_decision_maker = true THEN 1 END) as decision_makers,
        COUNT(CASE WHEN email_opt_out = false THEN 1 END) as marketable_contacts
      FROM crm_contacts
    `;

    const contactStatsResult = await pool.query(contactStatsQuery);

    // 4. Top Accounts by Activity
    const topAccountsQuery = `
      SELECT 
        a.account_id,
        a.account_name,
        a.account_type,
        a.rating,
        a.lifetime_value,
        COUNT(cl.communication_id) as communication_count,
        MAX(cl.communication_date) as last_contact_date
      FROM crm_accounts a
      LEFT JOIN crm_communication_log cl ON a.account_id = cl.account_id
        AND cl.communication_date >= CURRENT_DATE - INTERVAL '${periodDays} days'
      WHERE a.is_active = true
      GROUP BY a.account_id, a.account_name, a.account_type, a.rating, a.lifetime_value
      ORDER BY communication_count DESC, a.lifetime_value DESC
      LIMIT 10
    `;

    const topAccountsResult = await pool.query(topAccountsQuery);

    // 5. Communication Trends by Day
    const trendsQuery = `
      SELECT 
        DATE(communication_date) as date,
        COUNT(*) as count,
        COUNT(CASE WHEN direction = 'inbound' THEN 1 END) as inbound,
        COUNT(CASE WHEN direction = 'outbound' THEN 1 END) as outbound
      FROM crm_communication_log
      WHERE communication_date >= CURRENT_DATE - INTERVAL '${periodDays} days'
      GROUP BY DATE(communication_date)
      ORDER BY date DESC
    `;

    const trendsResult = await pool.query(trendsQuery);

    // 6. Communication by Type
    const typeBreakdownQuery = `
      SELECT 
        ct.type_name,
        ct.type_code,
        ct.icon,
        ct.color,
        COUNT(cl.communication_id) as count,
        AVG(cl.duration_minutes) as avg_duration
      FROM crm_communication_types ct
      LEFT JOIN crm_communication_log cl ON ct.communication_type_id = cl.communication_type_id
        AND cl.communication_date >= CURRENT_DATE - INTERVAL '${periodDays} days'
      WHERE ct.is_active = true
      GROUP BY ct.type_name, ct.type_code, ct.icon, ct.color
      ORDER BY count DESC
    `;

    const typeBreakdownResult = await pool.query(typeBreakdownQuery);

    // 7. Industry Distribution
    const industryQuery = `
      SELECT 
        industry,
        COUNT(*) as count,
        AVG(annual_revenue) as avg_revenue
      FROM crm_accounts
      WHERE is_active = true AND industry IS NOT NULL
      GROUP BY industry
      ORDER BY count DESC
      LIMIT 10
    `;

    const industryResult = await pool.query(industryQuery);

    // 8. Customer Type Distribution
    const customerTypeQuery = `
      SELECT 
        ct.type_name,
        COUNT(a.account_id) as count,
        AVG(a.annual_revenue) as avg_revenue,
        SUM(a.lifetime_value) as total_lifetime_value
      FROM crm_customer_types ct
      LEFT JOIN crm_accounts a ON ct.customer_type_id = a.customer_type_id AND a.is_active = true
      WHERE ct.is_active = true
      GROUP BY ct.type_name
      ORDER BY count DESC
    `;

    const customerTypeResult = await pool.query(customerTypeQuery);

    // 9. Accounts Needing Attention (no recent contact)
    const needsAttentionQuery = `
      SELECT 
        a.account_id,
        a.account_name,
        a.account_type,
        a.rating,
        MAX(cl.communication_date) as last_contact_date,
        DATE_PART('day', CURRENT_DATE - MAX(cl.communication_date)) as days_since_contact
      FROM crm_accounts a
      LEFT JOIN crm_communication_log cl ON a.account_id = cl.account_id
      WHERE a.is_active = true
        AND a.account_type IN ('customer', 'hot_prospect')
      GROUP BY a.account_id, a.account_name, a.account_type, a.rating
      HAVING MAX(cl.communication_date) < CURRENT_DATE - INTERVAL '30 days'
        OR MAX(cl.communication_date) IS NULL
      ORDER BY days_since_contact DESC NULLS FIRST
      LIMIT 20
    `;

    const needsAttentionResult = await pool.query(needsAttentionQuery);

    // 10. Recent New Accounts
    const recentAccountsQuery = `
      SELECT 
        account_id,
        account_number,
        account_name,
        account_type,
        industry,
        rating,
        created_at
      FROM crm_accounts
      WHERE created_at >= CURRENT_DATE - INTERVAL '${periodDays} days'
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const recentAccountsResult = await pool.query(recentAccountsQuery);

    return NextResponse.json({
      success: true,
      data: {
        overview: overviewResult.rows[0],
        activity: activityResult.rows[0],
        contacts: contactStatsResult.rows[0],
        top_accounts: topAccountsResult.rows,
        communication_trends: trendsResult.rows,
        communication_by_type: typeBreakdownResult.rows,
        industry_distribution: industryResult.rows,
        customer_type_distribution: customerTypeResult.rows,
        needs_attention: needsAttentionResult.rows,
        recent_accounts: recentAccountsResult.rows,
      },
      metadata: {
        period_days: periodDays,
        execution_time_ms: Date.now(),
        generated_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("CRM Dashboard API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate dashboard",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
