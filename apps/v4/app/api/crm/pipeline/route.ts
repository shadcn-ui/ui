// Phase 7 Task 2: Pipeline Visualization API
// GET /api/crm/pipeline

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://mac@localhost:5432/ocean-erp",
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ownerId = searchParams.get("owner_id");
    const includeOpportunities = searchParams.get("include_opportunities") !== "false";

    // Get pipeline stages with opportunity counts and totals
    let stagesQuery = `
      SELECT 
        ps.stage_id,
        ps.stage_name,
        ps.stage_code,
        ps.stage_order,
        ps.probability as stage_probability,
        ps.stage_category,
        ps.color,
        ps.icon,
        ps.expected_duration_days,
        COUNT(o.opportunity_id) as opportunity_count,
        SUM(o.amount) as total_amount,
        SUM(o.expected_revenue) as total_weighted_revenue,
        AVG(o.amount) as avg_deal_size,
        AVG(o.days_in_stage) as avg_days_in_stage,
        MAX(o.amount) as largest_deal,
        MIN(o.amount) as smallest_deal
      FROM crm_pipeline_stages ps
      LEFT JOIN crm_opportunities o ON ps.stage_id = o.stage_id 
        AND o.is_active = true 
        AND o.is_closed = false
    `;

    const stagesParams: any[] = [];
    
    if (ownerId) {
      stagesQuery += ` AND o.owner_id = $1`;
      stagesParams.push(parseInt(ownerId));
    }

    stagesQuery += `
      WHERE ps.is_active = true
      GROUP BY ps.stage_id, ps.stage_name, ps.stage_code, ps.stage_order, ps.probability, ps.stage_category, ps.color, ps.icon, ps.expected_duration_days
      ORDER BY ps.stage_order
    `;

    const stagesResult = await pool.query(stagesQuery, stagesParams);

    // Get opportunities for each stage if requested
    let opportunitiesByStage: any = {};

    if (includeOpportunities) {
      let oppsQuery = `
        SELECT 
          o.opportunity_id,
          o.opportunity_number,
          o.opportunity_name,
          o.stage_id,
          o.amount,
          o.expected_revenue,
          o.probability,
          o.expected_close_date,
          o.priority,
          o.days_in_stage,
          a.account_name,
          a.account_number,
          c.full_name as contact_name
        FROM crm_opportunities o
        JOIN crm_accounts a ON o.account_id = a.account_id
        LEFT JOIN crm_contacts c ON o.contact_id = c.contact_id
        WHERE o.is_active = true AND o.is_closed = false
      `;

      const oppsParams: any[] = [];

      if (ownerId) {
        oppsQuery += ` AND o.owner_id = $1`;
        oppsParams.push(parseInt(ownerId));
      }

      oppsQuery += ` ORDER BY o.amount DESC`;

      const oppsResult = await pool.query(oppsQuery, oppsParams);

      // Group opportunities by stage
      oppsResult.rows.forEach((opp) => {
        if (!opportunitiesByStage[opp.stage_id]) {
          opportunitiesByStage[opp.stage_id] = [];
        }
        opportunitiesByStage[opp.stage_id].push(opp);
      });
    }

    // Calculate overall pipeline metrics
    const metricsQuery = `
      SELECT 
        COUNT(*) as total_opportunities,
        SUM(amount) as total_pipeline_value,
        SUM(expected_revenue) as weighted_pipeline_value,
        AVG(amount) as avg_deal_size,
        AVG(total_days_open) as avg_sales_cycle_days,
        COUNT(CASE WHEN priority = 'critical' THEN 1 END) as critical_count,
        COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_count,
        COUNT(CASE WHEN has_competition = true THEN 1 END) as competitive_deals
      FROM crm_opportunities
      WHERE is_active = true AND is_closed = false
      ${ownerId ? 'AND owner_id = $1' : ''}
    `;

    const metricsParams = ownerId ? [parseInt(ownerId)] : [];
    const metricsResult = await pool.query(metricsQuery, metricsParams);

    // Get deals needing attention (stuck in stage too long)
    const attentionQuery = `
      SELECT 
        o.opportunity_id,
        o.opportunity_name,
        o.amount,
        o.days_in_stage,
        ps.stage_name,
        ps.expected_duration_days,
        a.account_name
      FROM crm_opportunities o
      JOIN crm_pipeline_stages ps ON o.stage_id = ps.stage_id
      JOIN crm_accounts a ON o.account_id = a.account_id
      WHERE o.is_active = true 
        AND o.is_closed = false
        AND o.days_in_stage > ps.expected_duration_days
        ${ownerId ? 'AND o.owner_id = $1' : ''}
      ORDER BY (o.days_in_stage - ps.expected_duration_days) DESC
      LIMIT 10
    `;

    const attentionParams = ownerId ? [parseInt(ownerId)] : [];
    const attentionResult = await pool.query(attentionQuery, attentionParams);

    // Get closing soon (expected close date within 7 days)
    const closingSoonQuery = `
      SELECT 
        o.opportunity_id,
        o.opportunity_name,
        o.amount,
        o.expected_close_date,
        ps.stage_name,
        a.account_name,
        DATE_PART('day', o.expected_close_date - CURRENT_DATE) as days_until_close
      FROM crm_opportunities o
      JOIN crm_pipeline_stages ps ON o.stage_id = ps.stage_id
      JOIN crm_accounts a ON o.account_id = a.account_id
      WHERE o.is_active = true 
        AND o.is_closed = false
        AND o.expected_close_date IS NOT NULL
        AND o.expected_close_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
        ${ownerId ? 'AND o.owner_id = $1' : ''}
      ORDER BY o.expected_close_date ASC
      LIMIT 10
    `;

    const closingSoonParams = ownerId ? [parseInt(ownerId)] : [];
    const closingSoonResult = await pool.query(closingSoonQuery, closingSoonParams);

    // Build pipeline data structure
    const pipeline = stagesResult.rows.map((stage) => ({
      ...stage,
      opportunities: includeOpportunities ? (opportunitiesByStage[stage.stage_id] || []) : undefined,
    }));

    return NextResponse.json({
      success: true,
      data: {
        pipeline,
        metrics: metricsResult.rows[0],
        needs_attention: attentionResult.rows,
        closing_soon: closingSoonResult.rows,
      },
      metadata: {
        owner_id: ownerId ? parseInt(ownerId) : null,
        include_opportunities: includeOpportunities,
        execution_time_ms: Date.now(),
        generated_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("CRM Pipeline API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch pipeline",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
