import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface PricingRequest {
  product_ids?: number[];
  category?: string;
  min_margin?: number;
  strategy?: 'maximize_revenue' | 'maximize_volume' | 'competitive' | 'balanced';
}

interface PricingRecommendation {
  product_id: number;
  product_code: string;
  product_name: string;
  category: string;
  current_price: number;
  cost_price: number;
  current_margin: number;
  recommended_price: number;
  recommended_margin: number;
  price_change_pct: number;
  expected_impact: {
    revenue_change_pct: number;
    volume_change_pct: number;
    profit_change_pct: number;
  };
  rationale: string;
  confidence_score: number;
  elasticity_estimate: number;
}

/**
 * @swagger
 * /api/analytics/recommendations/pricing:
 *   get:
 *     summary: Get dynamic pricing recommendations
 *     description: AI-powered pricing optimization based on demand elasticity, competition, margins, and sales velocity
 *     tags: [Prescriptive Analytics]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: min_margin
 *         schema:
 *           type: number
 *       - in: query
 *         name: strategy
 *         schema:
 *           type: string
 *           enum: [maximize_revenue, maximize_volume, competitive, balanced]
 *           default: balanced
 *     responses:
 *       200:
 *         description: Pricing recommendations with expected impact
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const min_margin = searchParams.get('min_margin');
    const strategy = (searchParams.get('strategy') || 'balanced') as PricingRequest['strategy'];

    const startTime = Date.now();

    // Comprehensive pricing analysis query
    const sqlQuery = `
      WITH product_sales AS (
        -- Analyze sales performance over last 90 days
        SELECT 
          soi.product_id,
          COUNT(DISTINCT so.order_id) as order_count,
          SUM(soi.quantity) as total_quantity,
          AVG(soi.unit_price) as avg_selling_price,
          MIN(soi.unit_price) as min_selling_price,
          MAX(soi.unit_price) as max_selling_price,
          SUM(soi.quantity * soi.unit_price) as total_revenue,
          AVG(soi.quantity) as avg_order_quantity
        FROM sales_order_items soi
        JOIN sales_orders so ON soi.order_id = so.order_id
        WHERE so.order_date >= CURRENT_DATE - INTERVAL '90 days'
          AND so.status NOT IN ('cancelled', 'rejected')
        GROUP BY soi.product_id
      ),
      price_sensitivity AS (
        -- Estimate price elasticity from historical price variations
        SELECT 
          soi.product_id,
          CORR(soi.unit_price, soi.quantity) as price_quantity_correlation,
          STDDEV(soi.unit_price) as price_variance,
          STDDEV(soi.quantity) as quantity_variance
        FROM sales_order_items soi
        JOIN sales_orders so ON soi.order_id = so.order_id
        WHERE so.order_date >= CURRENT_DATE - INTERVAL '180 days'
        GROUP BY soi.product_id
        HAVING COUNT(*) >= 10  -- Minimum data points for correlation
      ),
      inventory_velocity AS (
        -- Calculate inventory turnover rate
        SELECT 
          i.product_id,
          i.quantity_on_hand,
          CASE 
            WHEN i.quantity_on_hand > 0 THEN ps.total_quantity / i.quantity_on_hand
            ELSE 0
          END as turnover_rate_90d
        FROM inventory i
        LEFT JOIN product_sales ps ON i.product_id = ps.product_id
      ),
      competitor_analysis AS (
        -- Simulate competitor pricing (in real system, this would pull from market data)
        SELECT 
          p.product_id,
          p.unit_price * (0.9 + (RANDOM() * 0.2)) as estimated_market_price,
          CASE 
            WHEN RANDOM() < 0.3 THEN 'lower'
            WHEN RANDOM() < 0.7 THEN 'similar'
            ELSE 'higher'
          END as market_position
        FROM products p
      ),
      pricing_analysis AS (
        SELECT 
          p.product_id,
          p.product_code,
          p.product_name,
          p.category,
          p.unit_price as current_price,
          p.cost_price,
          ((p.unit_price - p.cost_price) / NULLIF(p.unit_price, 0) * 100) as current_margin,
          
          -- Sales metrics
          COALESCE(ps.total_quantity, 0) as sales_volume_90d,
          COALESCE(ps.total_revenue, 0) as revenue_90d,
          COALESCE(ps.order_count, 0) as order_count_90d,
          COALESCE(ps.avg_order_quantity, 0) as avg_order_qty,
          
          -- Price elasticity estimate
          COALESCE(
            CASE 
              WHEN price_sens.price_variance > 0 AND price_sens.quantity_variance > 0 THEN
                (price_sens.quantity_variance / price_sens.price_variance) * 
                (ps.avg_selling_price / NULLIF(ps.avg_order_quantity, 0))
              ELSE -1.2  -- Default moderate elasticity
            END,
            -1.2
          ) as elasticity,
          
          -- Inventory metrics
          COALESCE(iv.quantity_on_hand, 0) as current_inventory,
          COALESCE(iv.turnover_rate_90d, 0) as turnover_rate,
          
          -- Market position
          ca.estimated_market_price,
          ca.market_position,
          
          -- Confidence score based on data availability
          CASE 
            WHEN ps.order_count >= 20 THEN 0.9
            WHEN ps.order_count >= 10 THEN 0.7
            WHEN ps.order_count >= 5 THEN 0.5
            ELSE 0.3
          END as confidence_score
          
        FROM products p
        LEFT JOIN product_sales ps ON p.product_id = ps.product_id
        LEFT JOIN price_sensitivity price_sens ON p.product_id = price_sens.product_id
        LEFT JOIN inventory_velocity iv ON p.product_id = iv.product_id
        LEFT JOIN competitor_analysis ca ON p.product_id = ca.product_id
        WHERE p.status = 'active'
          AND p.unit_price > 0
          AND p.cost_price > 0
          ${category ? `AND p.category = $1` : ''}
      ),
      recommendations AS (
        SELECT 
          pa.*,
          
          -- Calculate recommended price based on strategy
          CASE 
            -- Strategy: Maximize Revenue (increase price if demand is inelastic)
            WHEN $${category ? '2' : '1'} = 'maximize_revenue' THEN
              CASE 
                WHEN pa.elasticity > -1.0 THEN pa.current_price * 1.10  -- Inelastic: increase price
                WHEN pa.elasticity < -1.5 THEN pa.current_price * 0.95   -- Elastic: slight decrease
                ELSE pa.current_price * 1.05
              END
              
            -- Strategy: Maximize Volume (reduce price to drive sales)
            WHEN $${category ? '2' : '1'} = 'maximize_volume' THEN
              CASE 
                WHEN pa.turnover_rate < 1.0 THEN pa.current_price * 0.90  -- Slow movers: discount
                WHEN pa.turnover_rate < 2.0 THEN pa.current_price * 0.95
                ELSE pa.current_price * 0.98
              END
              
            -- Strategy: Competitive (match or beat market)
            WHEN $${category ? '2' : '1'} = 'competitive' THEN
              CASE 
                WHEN pa.market_position = 'higher' THEN pa.estimated_market_price * 0.98
                WHEN pa.market_position = 'lower' THEN pa.estimated_market_price * 1.02
                ELSE pa.estimated_market_price
              END
              
            -- Strategy: Balanced (optimize for profit)
            ELSE
              CASE 
                -- High inventory + low turnover: reduce price
                WHEN pa.turnover_rate < 1.0 AND pa.current_inventory > 100 THEN pa.current_price * 0.92
                -- Low inventory + high demand: increase price
                WHEN pa.turnover_rate > 3.0 AND pa.current_inventory < 50 THEN pa.current_price * 1.08
                -- Below market: increase gradually
                WHEN pa.current_price < pa.estimated_market_price * 0.95 THEN pa.current_price * 1.05
                -- Above market: decrease gradually
                WHEN pa.current_price > pa.estimated_market_price * 1.05 THEN pa.current_price * 0.97
                -- Optimal range: minor adjustments
                ELSE pa.current_price * 1.02
              END
          END as recommended_price
          
        FROM pricing_analysis pa
      )
      SELECT 
        product_id,
        product_code,
        product_name,
        category,
        ROUND(current_price::NUMERIC, 2) as current_price,
        ROUND(cost_price::NUMERIC, 2) as cost_price,
        ROUND(current_margin::NUMERIC, 2) as current_margin,
        ROUND(recommended_price::NUMERIC, 2) as recommended_price,
        ROUND(((recommended_price - cost_price) / NULLIF(recommended_price, 0) * 100)::NUMERIC, 2) as recommended_margin,
        ROUND(((recommended_price - current_price) / NULLIF(current_price, 0) * 100)::NUMERIC, 2) as price_change_pct,
        ROUND(elasticity::NUMERIC, 2) as elasticity,
        ROUND(confidence_score::NUMERIC, 2) as confidence_score,
        sales_volume_90d,
        revenue_90d,
        turnover_rate,
        market_position
      FROM recommendations
      WHERE 
        -- Apply minimum margin constraint if specified
        ${min_margin ? `((recommended_price - cost_price) / NULLIF(recommended_price, 0) * 100) >= ${parseFloat(min_margin)} AND` : ''}
        -- Only recommend if there's a meaningful change
        ABS(recommended_price - current_price) / NULLIF(current_price, 0) >= 0.02
      ORDER BY 
        ABS(recommended_price - current_price) DESC,
        revenue_90d DESC
      LIMIT 100
    `;

    const params: any[] = [];
    if (category) params.push(category);
    params.push(strategy);

    const result = await query(sqlQuery, params);
    const executionTime = Date.now() - startTime;

    const recommendations: PricingRecommendation[] = result.rows.map(row => {
      const priceChangePct = parseFloat(row.price_change_pct);
      const elasticity = parseFloat(row.elasticity);
      
      // Estimate volume change based on price elasticity
      const volumeChangePct = priceChangePct * elasticity;
      
      // Estimate revenue change: (1 + price_change) × (1 + volume_change) - 1
      const revenueChangePct = ((1 + priceChangePct / 100) * (1 + volumeChangePct / 100) - 1) * 100;
      
      // Estimate profit change
      const currentProfit = parseFloat(row.current_price) - parseFloat(row.cost_price);
      const newProfit = parseFloat(row.recommended_price) - parseFloat(row.cost_price);
      const profitChangePct = ((newProfit / currentProfit - 1) * 100) * (1 + volumeChangePct / 100);
      
      // Generate rationale
      let rationale = '';
      if (strategy === 'maximize_revenue') {
        rationale = elasticity > -1.0 
          ? 'Inelastic demand allows price increase without significant volume loss'
          : 'Price adjustment optimizes revenue based on demand sensitivity';
      } else if (strategy === 'maximize_volume') {
        rationale = parseFloat(row.turnover_rate) < 1.0
          ? 'Slow-moving inventory requires aggressive pricing to accelerate sales'
          : 'Price reduction drives volume growth';
      } else if (strategy === 'competitive') {
        rationale = row.market_position === 'higher'
          ? 'Current price is above market - reduction improves competitiveness'
          : row.market_position === 'lower'
          ? 'Price below market - opportunity to increase margins'
          : 'Price adjustment aligns with market positioning';
      } else {
        if (parseFloat(row.turnover_rate) < 1.0) {
          rationale = 'Low inventory turnover suggests price reduction to move stock';
        } else if (parseFloat(row.turnover_rate) > 3.0) {
          rationale = 'High demand and low inventory justify price increase';
        } else {
          rationale = 'Balanced optimization of margin and market position';
        }
      }

      return {
        product_id: parseInt(row.product_id),
        product_code: row.product_code,
        product_name: row.product_name,
        category: row.category,
        current_price: parseFloat(row.current_price),
        cost_price: parseFloat(row.cost_price),
        current_margin: parseFloat(row.current_margin),
        recommended_price: parseFloat(row.recommended_price),
        recommended_margin: parseFloat(row.recommended_margin),
        price_change_pct: priceChangePct,
        expected_impact: {
          revenue_change_pct: parseFloat(revenueChangePct.toFixed(2)),
          volume_change_pct: parseFloat(volumeChangePct.toFixed(2)),
          profit_change_pct: parseFloat(profitChangePct.toFixed(2))
        },
        rationale,
        confidence_score: parseFloat(row.confidence_score),
        elasticity_estimate: elasticity
      };
    });

    // Calculate summary statistics
    const summary = {
      total_recommendations: recommendations.length,
      price_increases: recommendations.filter(r => r.price_change_pct > 0).length,
      price_decreases: recommendations.filter(r => r.price_change_pct < 0).length,
      avg_price_change_pct: recommendations.length > 0
        ? recommendations.reduce((sum, r) => sum + r.price_change_pct, 0) / recommendations.length
        : 0,
      expected_revenue_impact_pct: recommendations.length > 0
        ? recommendations.reduce((sum, r) => sum + r.expected_impact.revenue_change_pct, 0) / recommendations.length
        : 0,
      high_confidence_count: recommendations.filter(r => r.confidence_score >= 0.7).length
    };

    return NextResponse.json({
      recommendations,
      summary: {
        ...summary,
        avg_price_change_pct: parseFloat(summary.avg_price_change_pct.toFixed(2)),
        expected_revenue_impact_pct: parseFloat(summary.expected_revenue_impact_pct.toFixed(2))
      },
      strategy,
      filters: {
        category: category || null,
        min_margin: min_margin ? parseFloat(min_margin) : null
      },
      metadata: {
        execution_time_ms: executionTime,
        generated_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in pricing recommendations API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint to apply pricing recommendation
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, new_price, effective_date, notes } = body;

    if (!product_id || !new_price) {
      return NextResponse.json(
        { error: 'product_id and new_price are required' },
        { status: 400 }
      );
    }

    // Update product price
    const updateQuery = `
      UPDATE products 
      SET 
        unit_price = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE product_id = $2
      RETURNING product_id, product_name, unit_price
    `;

    const result = await query(updateQuery, [new_price, product_id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Log price change for audit trail
    const logQuery = `
      INSERT INTO price_history (
        product_id,
        old_price,
        new_price,
        change_date,
        changed_by,
        notes
      )
      SELECT 
        p.product_id,
        p.unit_price as old_price,
        $1 as new_price,
        COALESCE($2::DATE, CURRENT_DATE) as change_date,
        'system' as changed_by,
        $3 as notes
      FROM products p
      WHERE p.product_id = $4
    `;

    await query(logQuery, [new_price, effective_date, notes || 'Applied from pricing recommendation', product_id]);

    return NextResponse.json({
      success: true,
      product: result.rows[0],
      message: 'Price updated successfully'
    });

  } catch (error) {
    console.error('Error applying pricing recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to update price', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
