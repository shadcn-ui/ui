// Phase 7 Task 2: Sales Forecasting API
// GET /api/crm/forecasts

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://mac@localhost:5432/ocean-erp",
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "current_quarter";
    const ownerId = searchParams.get("owner_id");

    let startDate: Date;
    let endDate: Date;
    let periodName: string;

    // Calculate period dates
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentQuarter = Math.floor(currentMonth / 3) + 1;

    switch (period) {
      case "current_month":
        startDate = new Date(currentYear, currentMonth, 1);
        endDate = new Date(currentYear, currentMonth + 1, 0);
        periodName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
        break;

      case "next_month":
        startDate = new Date(currentYear, currentMonth + 1, 1);
        endDate = new Date(currentYear, currentMonth + 2, 0);
        const nextMonth = new Date(currentYear, currentMonth + 1, 1);
        periodName = nextMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
        break;

      case "current_quarter":
        startDate = new Date(currentYear, (currentQuarter - 1) * 3, 1);
        endDate = new Date(currentYear, currentQuarter * 3, 0);
        periodName = `Q${currentQuarter} ${currentYear}`;
        break;

      case "next_quarter":
        const nextQuarter = currentQuarter === 4 ? 1 : currentQuarter + 1;
        const nextQuarterYear = currentQuarter === 4 ? currentYear + 1 : currentYear;
        startDate = new Date(nextQuarterYear, (nextQuarter - 1) * 3, 1);
        endDate = new Date(nextQuarterYear, nextQuarter * 3, 0);
        periodName = `Q${nextQuarter} ${nextQuarterYear}`;
        break;

      case "current_year":
        startDate = new Date(currentYear, 0, 1);
        endDate = new Date(currentYear, 11, 31);
        periodName = `${currentYear}`;
        break;

      default:
        startDate = new Date(currentYear, (currentQuarter - 1) * 3, 1);
        endDate = new Date(currentYear, currentQuarter * 3, 0);
        periodName = `Q${currentQuarter} ${currentYear}`;
    }

    // Build base query conditions
    const ownerCondition = ownerId ? `AND o.owner_id = ${parseInt(ownerId)}` : '';

    // Calculate pipeline metrics
    const pipelineQuery = `
      SELECT 
        COUNT(*) as total_opportunities,
        SUM(o.amount) as pipeline_revenue,
        SUM(o.expected_revenue) as weighted_revenue,
        SUM(CASE WHEN o.probability >= 75 THEN o.amount ELSE 0 END) as committed_revenue,
        SUM(CASE WHEN o.probability >= 50 THEN o.expected_revenue ELSE 0 END) as best_case_revenue,
        AVG(o.amount) as average_deal_size,
        AVG(o.probability) as average_probability
      FROM crm_opportunities o
      WHERE o.is_active = true
        AND o.is_closed = false
        AND o.expected_close_date BETWEEN $1 AND $2
        ${ownerCondition}
    `;

    const pipelineResult = await pool.query(pipelineQuery, [startDate, endDate]);

    // Calculate closed won revenue
    const closedWonQuery = `
      SELECT 
        COUNT(*) as won_count,
        SUM(amount) as closed_won_revenue,
        AVG(total_days_open) as avg_sales_cycle_days
      FROM crm_opportunities
      WHERE is_won = true
        AND close_date BETWEEN $1 AND $2
        ${ownerCondition}
    `;

    const closedWonResult = await pool.query(closedWonQuery, [startDate, endDate]);

    // Calculate win rate
    const winRateQuery = `
      SELECT 
        COUNT(*) as total_closed,
        COUNT(CASE WHEN is_won = true THEN 1 END) as won_count,
        COUNT(CASE WHEN is_won = false THEN 1 END) as lost_count,
        CASE 
          WHEN COUNT(*) > 0 
          THEN ROUND((COUNT(CASE WHEN is_won = true THEN 1 END)::DECIMAL / COUNT(*)) * 100, 2)
          ELSE 0 
        END as win_rate_percent
      FROM crm_opportunities
      WHERE is_closed = true
        AND close_date BETWEEN $1 AND $2
        ${ownerCondition}
    `;

    const winRateResult = await pool.query(winRateQuery, [startDate, endDate]);

    // Get opportunities by stage
    const byStageQuery = `
      SELECT 
        ps.stage_name,
        ps.stage_code,
        ps.stage_order,
        ps.probability as stage_probability,
        COUNT(o.opportunity_id) as opportunity_count,
        SUM(o.amount) as total_amount,
        SUM(o.expected_revenue) as weighted_revenue
      FROM crm_pipeline_stages ps
      LEFT JOIN crm_opportunities o ON ps.stage_id = o.stage_id
        AND o.is_active = true
        AND o.is_closed = false
        AND o.expected_close_date BETWEEN $1 AND $2
        ${ownerCondition}
      WHERE ps.is_active = true AND ps.is_closed = false
      GROUP BY ps.stage_id, ps.stage_name, ps.stage_code, ps.stage_order, ps.probability
      ORDER BY ps.stage_order
    `;

    const byStageResult = await pool.query(byStageQuery, [startDate, endDate]);

    // Get top opportunities
    const topOppsQuery = `
      SELECT 
        o.opportunity_id,
        o.opportunity_number,
        o.opportunity_name,
        o.amount,
        o.expected_revenue,
        o.probability,
        o.expected_close_date,
        a.account_name,
        ps.stage_name
      FROM crm_opportunities o
      JOIN crm_accounts a ON o.account_id = a.account_id
      JOIN crm_pipeline_stages ps ON o.stage_id = ps.stage_id
      WHERE o.is_active = true
        AND o.is_closed = false
        AND o.expected_close_date BETWEEN $1 AND $2
        ${ownerCondition}
      ORDER BY o.amount DESC
      LIMIT 10
    `;

    const topOppsResult = await pool.query(topOppsQuery, [startDate, endDate]);

    // Get opportunities at risk (low probability, closing soon)
    const atRiskQuery = `
      SELECT 
        o.opportunity_id,
        o.opportunity_number,
        o.opportunity_name,
        o.amount,
        o.probability,
        o.expected_close_date,
        a.account_name,
        ps.stage_name,
        DATE_PART('day', o.expected_close_date - CURRENT_DATE) as days_until_close
      FROM crm_opportunities o
      JOIN crm_accounts a ON o.account_id = a.account_id
      JOIN crm_pipeline_stages ps ON o.stage_id = ps.stage_id
      WHERE o.is_active = true
        AND o.is_closed = false
        AND o.expected_close_date BETWEEN $1 AND $2
        AND o.probability < 50
        AND o.expected_close_date <= CURRENT_DATE + INTERVAL '30 days'
        ${ownerCondition}
      ORDER BY o.expected_close_date ASC
      LIMIT 10
    `;

    const atRiskResult = await pool.query(atRiskQuery, [startDate, endDate]);

    // Get historical performance (previous period)
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 3);
    const previousPeriodEnd = new Date(endDate);
    previousPeriodEnd.setMonth(previousPeriodEnd.getMonth() - 3);

    const historicalQuery = `
      SELECT 
        COUNT(*) as deals_closed,
        SUM(amount) as revenue,
        AVG(amount) as avg_deal_size,
        AVG(total_days_open) as avg_sales_cycle
      FROM crm_opportunities
      WHERE is_won = true
        AND close_date BETWEEN $1 AND $2
        ${ownerCondition}
    `;

    const historicalResult = await pool.query(historicalQuery, [previousPeriodStart, previousPeriodEnd]);

    return NextResponse.json({
      success: true,
      data: {
        period: {
          name: periodName,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
        },
        forecast: {
          ...pipelineResult.rows[0],
          ...closedWonResult.rows[0],
          win_rate: winRateResult.rows[0],
        },
        by_stage: byStageResult.rows,
        top_opportunities: topOppsResult.rows,
        at_risk: atRiskResult.rows,
        historical_comparison: historicalResult.rows[0],
      },
      metadata: {
        owner_id: ownerId ? parseInt(ownerId) : null,
        execution_time_ms: Date.now(),
        generated_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("CRM Forecast API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate forecast",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
