// Phase 7 Task 2: Win/Loss Analysis API
// GET /api/crm/opportunities/analysis

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://mac@localhost:5432/ocean-erp",
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "90"; // days
    const periodDays = parseInt(period);
    const ownerId = searchParams.get("owner_id");

    const ownerCondition = ownerId ? `AND o.owner_id = ${parseInt(ownerId)}` : '';

    // Overall win/loss statistics
    const overallQuery = `
      SELECT 
        COUNT(*) as total_closed,
        COUNT(CASE WHEN is_won = true THEN 1 END) as won_count,
        COUNT(CASE WHEN is_won = false THEN 1 END) as lost_count,
        SUM(CASE WHEN is_won = true THEN amount ELSE 0 END) as won_revenue,
        SUM(CASE WHEN is_won = false THEN amount ELSE 0 END) as lost_revenue,
        AVG(CASE WHEN is_won = true THEN amount END) as avg_won_deal_size,
        AVG(CASE WHEN is_won = false THEN amount END) as avg_lost_deal_size,
        AVG(CASE WHEN is_won = true THEN total_days_open END) as avg_won_sales_cycle,
        AVG(CASE WHEN is_won = false THEN total_days_open END) as avg_lost_sales_cycle,
        CASE 
          WHEN COUNT(*) > 0 
          THEN ROUND((COUNT(CASE WHEN is_won = true THEN 1 END)::DECIMAL / COUNT(*)) * 100, 2)
          ELSE 0 
        END as win_rate_percent
      FROM crm_opportunities o
      WHERE is_closed = true
        AND close_date >= CURRENT_DATE - INTERVAL '${periodDays} days'
        ${ownerCondition}
    `;

    const overallResult = await pool.query(overallQuery);

    // Win reasons breakdown
    const winReasonsQuery = `
      SELECT 
        wlr.reason_name,
        wlr.category,
        COUNT(*) as count,
        SUM(o.amount) as total_revenue,
        AVG(o.amount) as avg_deal_size,
        ROUND((COUNT(*)::DECIMAL / (SELECT COUNT(*) FROM crm_opportunities WHERE is_won = true AND close_date >= CURRENT_DATE - INTERVAL '${periodDays} days' ${ownerCondition})) * 100, 2) as percentage
      FROM crm_opportunities o
      JOIN crm_win_loss_reasons wlr ON o.win_loss_reason_id = wlr.win_loss_reason_id
      WHERE o.is_won = true
        AND o.close_date >= CURRENT_DATE - INTERVAL '${periodDays} days'
        ${ownerCondition}
      GROUP BY wlr.reason_name, wlr.category
      ORDER BY count DESC
    `;

    const winReasonsResult = await pool.query(winReasonsQuery);

    // Loss reasons breakdown
    const lossReasonsQuery = `
      SELECT 
        wlr.reason_name,
        wlr.category,
        COUNT(*) as count,
        SUM(o.amount) as lost_revenue,
        AVG(o.amount) as avg_deal_size,
        ROUND((COUNT(*)::DECIMAL / (SELECT COUNT(*) FROM crm_opportunities WHERE is_won = false AND is_closed = true AND close_date >= CURRENT_DATE - INTERVAL '${periodDays} days' ${ownerCondition})) * 100, 2) as percentage
      FROM crm_opportunities o
      JOIN crm_win_loss_reasons wlr ON o.win_loss_reason_id = wlr.win_loss_reason_id
      WHERE o.is_won = false
        AND o.is_closed = true
        AND o.close_date >= CURRENT_DATE - INTERVAL '${periodDays} days'
        ${ownerCondition}
      GROUP BY wlr.reason_name, wlr.category
      ORDER BY count DESC
    `;

    const lossReasonsResult = await pool.query(lossReasonsQuery);

    // Win rate by opportunity type
    const byTypeQuery = `
      SELECT 
        opportunity_type,
        COUNT(*) as total,
        COUNT(CASE WHEN is_won = true THEN 1 END) as won,
        COUNT(CASE WHEN is_won = false THEN 1 END) as lost,
        CASE 
          WHEN COUNT(*) > 0 
          THEN ROUND((COUNT(CASE WHEN is_won = true THEN 1 END)::DECIMAL / COUNT(*)) * 100, 2)
          ELSE 0 
        END as win_rate_percent,
        SUM(amount) as total_value
      FROM crm_opportunities
      WHERE is_closed = true
        AND close_date >= CURRENT_DATE - INTERVAL '${periodDays} days'
        ${ownerCondition}
      GROUP BY opportunity_type
      ORDER BY win_rate_percent DESC
    `;

    const byTypeResult = await pool.query(byTypeQuery);

    // Win rate by deal size
    const byDealSizeQuery = `
      SELECT 
        CASE 
          WHEN amount < 10000 THEN 'Small (<$10K)'
          WHEN amount < 50000 THEN 'Medium ($10K-$50K)'
          WHEN amount < 100000 THEN 'Large ($50K-$100K)'
          ELSE 'Enterprise (>$100K)'
        END as deal_size_category,
        COUNT(*) as total,
        COUNT(CASE WHEN is_won = true THEN 1 END) as won,
        CASE 
          WHEN COUNT(*) > 0 
          THEN ROUND((COUNT(CASE WHEN is_won = true THEN 1 END)::DECIMAL / COUNT(*)) * 100, 2)
          ELSE 0 
        END as win_rate_percent
      FROM crm_opportunities
      WHERE is_closed = true
        AND close_date >= CURRENT_DATE - INTERVAL '${periodDays} days'
        AND amount IS NOT NULL
        ${ownerCondition}
      GROUP BY deal_size_category
      ORDER BY 
        CASE deal_size_category
          WHEN 'Small (<$10K)' THEN 1
          WHEN 'Medium ($10K-$50K)' THEN 2
          WHEN 'Large ($50K-$100K)' THEN 3
          WHEN 'Enterprise (>$100K)' THEN 4
        END
    `;

    const byDealSizeResult = await pool.query(byDealSizeQuery);

    // Monthly trend
    const trendQuery = `
      SELECT 
        TO_CHAR(close_date, 'YYYY-MM') as month,
        COUNT(*) as total_closed,
        COUNT(CASE WHEN is_won = true THEN 1 END) as won,
        COUNT(CASE WHEN is_won = false THEN 1 END) as lost,
        SUM(CASE WHEN is_won = true THEN amount ELSE 0 END) as won_revenue,
        CASE 
          WHEN COUNT(*) > 0 
          THEN ROUND((COUNT(CASE WHEN is_won = true THEN 1 END)::DECIMAL / COUNT(*)) * 100, 2)
          ELSE 0 
        END as win_rate_percent
      FROM crm_opportunities
      WHERE is_closed = true
        AND close_date >= CURRENT_DATE - INTERVAL '${periodDays} days'
        ${ownerCondition}
      GROUP BY month
      ORDER BY month DESC
    `;

    const trendResult = await pool.query(trendQuery);

    // Competitive wins/losses
    const competitiveQuery = `
      SELECT 
        has_competition,
        COUNT(*) as total,
        COUNT(CASE WHEN is_won = true THEN 1 END) as won,
        COUNT(CASE WHEN is_won = false THEN 1 END) as lost,
        CASE 
          WHEN COUNT(*) > 0 
          THEN ROUND((COUNT(CASE WHEN is_won = true THEN 1 END)::DECIMAL / COUNT(*)) * 100, 2)
          ELSE 0 
        END as win_rate_percent
      FROM crm_opportunities
      WHERE is_closed = true
        AND close_date >= CURRENT_DATE - INTERVAL '${periodDays} days'
        ${ownerCondition}
      GROUP BY has_competition
      ORDER BY has_competition DESC
    `;

    const competitiveResult = await pool.query(competitiveQuery);

    // Recent wins
    const recentWinsQuery = `
      SELECT 
        o.opportunity_id,
        o.opportunity_number,
        o.opportunity_name,
        o.amount,
        o.close_date,
        a.account_name,
        wlr.reason_name as win_reason
      FROM crm_opportunities o
      JOIN crm_accounts a ON o.account_id = a.account_id
      LEFT JOIN crm_win_loss_reasons wlr ON o.win_loss_reason_id = wlr.win_loss_reason_id
      WHERE o.is_won = true
        AND o.close_date >= CURRENT_DATE - INTERVAL '${periodDays} days'
        ${ownerCondition}
      ORDER BY o.close_date DESC
      LIMIT 10
    `;

    const recentWinsResult = await pool.query(recentWinsQuery);

    // Recent losses
    const recentLossesQuery = `
      SELECT 
        o.opportunity_id,
        o.opportunity_number,
        o.opportunity_name,
        o.amount,
        o.close_date,
        a.account_name,
        wlr.reason_name as loss_reason
      FROM crm_opportunities o
      JOIN crm_accounts a ON o.account_id = a.account_id
      LEFT JOIN crm_win_loss_reasons wlr ON o.win_loss_reason_id = wlr.win_loss_reason_id
      WHERE o.is_won = false
        AND o.is_closed = true
        AND o.close_date >= CURRENT_DATE - INTERVAL '${periodDays} days'
        ${ownerCondition}
      ORDER BY o.close_date DESC
      LIMIT 10
    `;

    const recentLossesResult = await pool.query(recentLossesQuery);

    return NextResponse.json({
      success: true,
      data: {
        overall: overallResult.rows[0],
        win_reasons: winReasonsResult.rows,
        loss_reasons: lossReasonsResult.rows,
        by_opportunity_type: byTypeResult.rows,
        by_deal_size: byDealSizeResult.rows,
        monthly_trend: trendResult.rows,
        competitive_analysis: competitiveResult.rows,
        recent_wins: recentWinsResult.rows,
        recent_losses: recentLossesResult.rows,
      },
      metadata: {
        period_days: periodDays,
        owner_id: ownerId ? parseInt(ownerId) : null,
        execution_time_ms: Date.now(),
        generated_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("CRM Win/Loss Analysis API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate analysis",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
