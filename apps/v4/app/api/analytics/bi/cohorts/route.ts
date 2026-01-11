import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface CohortRequest {
  cohort_type: 'customer_retention' | 'product_repurchase' | 'customer_lifecycle';
  cohort_period: 'day' | 'week' | 'month' | 'quarter';
  metric: 'count' | 'revenue' | 'orders' | 'retention_rate';
  start_date: string;
  end_date: string;
  filters?: Record<string, any>;
}

/**
 * @swagger
 * /api/analytics/bi/cohorts:
 *   post:
 *     summary: Generate cohort analysis reports
 *     description: Analyze customer retention, repurchase behavior, and lifecycle metrics
 *     tags: [Business Intelligence]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cohort_type
 *               - cohort_period
 *               - metric
 *               - start_date
 *               - end_date
 *             properties:
 *               cohort_type:
 *                 type: string
 *                 enum: [customer_retention, product_repurchase, customer_lifecycle]
 *               cohort_period:
 *                 type: string
 *                 enum: [day, week, month, quarter]
 *               metric:
 *                 type: string
 *                 enum: [count, revenue, orders, retention_rate]
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               filters:
 *                 type: object
 *     responses:
 *       200:
 *         description: Cohort analysis data
 */
export async function POST(request: Request) {
  try {
    const body: CohortRequest = await request.json();
    
    const {
      cohort_type,
      cohort_period,
      metric,
      start_date,
      end_date,
      filters = {}
    } = body;

    // Validate required fields
    if (!cohort_type || !cohort_period || !metric || !start_date || !end_date) {
      return NextResponse.json(
        { error: 'cohort_type, cohort_period, metric, start_date, and end_date are required' },
        { status: 400 }
      );
    }

    let sqlQuery = '';
    const params: any[] = [start_date, end_date];

    if (cohort_type === 'customer_retention') {
      // Customer Retention Cohort Analysis
      // Groups customers by their first purchase date and tracks subsequent purchases
      
      const periodTrunc = cohort_period === 'day' ? 'DATE' : 
                         cohort_period === 'week' ? 'DATE_TRUNC(\'week\', {})' :
                         cohort_period === 'month' ? 'DATE_TRUNC(\'month\', {})' :
                         'DATE_TRUNC(\'quarter\', {})';

      sqlQuery = `
        WITH first_purchase AS (
          SELECT 
            so.customer_id,
            ${periodTrunc.replace('{}', 'MIN(so.order_date)')} as cohort_period,
            MIN(so.order_date) as first_order_date
          FROM fact_sales fs
          JOIN sales_orders so ON fs.order_id = so.order_id
          WHERE so.order_date BETWEEN $1 AND $2
          GROUP BY so.customer_id
        ),
        subsequent_purchases AS (
          SELECT 
            fp.customer_id,
            fp.cohort_period,
            ${periodTrunc.replace('{}', 'so.order_date')} as purchase_period,
            COUNT(DISTINCT so.order_id) as order_count,
            SUM(so.total_amount) as revenue
          FROM first_purchase fp
          JOIN sales_orders so ON fp.customer_id = so.customer_id
          WHERE so.order_date >= fp.first_order_date
          GROUP BY fp.customer_id, fp.cohort_period, ${periodTrunc.replace('{}', 'so.order_date')}
        ),
        cohort_data AS (
          SELECT 
            cohort_period,
            purchase_period,
            EXTRACT(EPOCH FROM (purchase_period - cohort_period)) / (86400 * 
              CASE 
                WHEN '${cohort_period}' = 'day' THEN 1
                WHEN '${cohort_period}' = 'week' THEN 7
                WHEN '${cohort_period}' = 'month' THEN 30
                ELSE 90
              END
            )::INTEGER as period_number,
            COUNT(DISTINCT customer_id) as customer_count,
            SUM(order_count) as total_orders,
            SUM(revenue) as total_revenue
          FROM subsequent_purchases
          GROUP BY cohort_period, purchase_period
        ),
        cohort_size AS (
          SELECT 
            cohort_period,
            COUNT(DISTINCT customer_id) as initial_customers
          FROM first_purchase
          GROUP BY cohort_period
        )
        SELECT 
          cd.cohort_period,
          cd.period_number,
          cd.customer_count,
          cd.total_orders,
          cd.total_revenue,
          cs.initial_customers,
          ROUND((cd.customer_count::NUMERIC / cs.initial_customers * 100), 2) as retention_rate
        FROM cohort_data cd
        JOIN cohort_size cs ON cd.cohort_period = cs.cohort_period
        ORDER BY cd.cohort_period, cd.period_number
      `;

    } else if (cohort_type === 'product_repurchase') {
      // Product Repurchase Cohort
      // Tracks which products customers buy again
      
      sqlQuery = `
        WITH first_product_purchase AS (
          SELECT 
            soi.product_id,
            so.customer_id,
            DATE_TRUNC('${cohort_period}', MIN(so.order_date)) as cohort_period,
            MIN(so.order_date) as first_purchase_date
          FROM sales_order_items soi
          JOIN sales_orders so ON soi.order_id = so.order_id
          WHERE so.order_date BETWEEN $1 AND $2
          GROUP BY soi.product_id, so.customer_id
        ),
        repurchases AS (
          SELECT 
            fpp.product_id,
            fpp.cohort_period,
            DATE_TRUNC('${cohort_period}', so.order_date) as purchase_period,
            COUNT(DISTINCT so.customer_id) as repurchase_customers,
            COUNT(DISTINCT so.order_id) as repurchase_orders,
            SUM(soi.total_price) as repurchase_revenue
          FROM first_product_purchase fpp
          JOIN sales_orders so ON fpp.customer_id = so.customer_id
          JOIN sales_order_items soi ON so.order_id = soi.order_id AND soi.product_id = fpp.product_id
          WHERE so.order_date > fpp.first_purchase_date
          GROUP BY fpp.product_id, fpp.cohort_period, DATE_TRUNC('${cohort_period}', so.order_date)
        ),
        product_info AS (
          SELECT DISTINCT ON (product_id)
            product_id,
            product_name,
            category
          FROM dim_product
          WHERE is_current = TRUE
        )
        SELECT 
          pi.product_name,
          pi.category,
          r.cohort_period,
          r.purchase_period,
          r.repurchase_customers,
          r.repurchase_orders,
          r.repurchase_revenue,
          ROUND((r.repurchase_revenue / NULLIF(r.repurchase_orders, 0))::NUMERIC, 2) as avg_order_value
        FROM repurchases r
        JOIN product_info pi ON r.product_id = pi.product_id
        ORDER BY r.cohort_period, r.purchase_period, r.repurchase_revenue DESC
        LIMIT 100
      `;

    } else if (cohort_type === 'customer_lifecycle') {
      // Customer Lifecycle Value Cohort
      // Tracks cumulative value of customers over time
      
      sqlQuery = `
        WITH customer_first_order AS (
          SELECT 
            customer_id,
            DATE_TRUNC('${cohort_period}', MIN(order_date)) as cohort_period,
            MIN(order_date) as first_order_date
          FROM sales_orders
          WHERE order_date BETWEEN $1 AND $2
          GROUP BY customer_id
        ),
        customer_metrics AS (
          SELECT 
            cfo.customer_id,
            cfo.cohort_period,
            DATE_TRUNC('${cohort_period}', so.order_date) as period,
            COUNT(so.order_id) as orders_in_period,
            SUM(so.total_amount) as revenue_in_period,
            AVG(so.total_amount) as avg_order_value,
            EXTRACT(EPOCH FROM (DATE_TRUNC('${cohort_period}', so.order_date) - cfo.cohort_period)) / (86400 * 
              CASE 
                WHEN '${cohort_period}' = 'day' THEN 1
                WHEN '${cohort_period}' = 'week' THEN 7
                WHEN '${cohort_period}' = 'month' THEN 30
                ELSE 90
              END
            )::INTEGER as period_number
          FROM customer_first_order cfo
          JOIN sales_orders so ON cfo.customer_id = so.customer_id
          WHERE so.order_date >= cfo.first_order_date
          GROUP BY cfo.customer_id, cfo.cohort_period, DATE_TRUNC('${cohort_period}', so.order_date)
        ),
        cumulative_metrics AS (
          SELECT 
            customer_id,
            cohort_period,
            period_number,
            SUM(orders_in_period) OVER (
              PARTITION BY customer_id, cohort_period 
              ORDER BY period_number
              ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            ) as cumulative_orders,
            SUM(revenue_in_period) OVER (
              PARTITION BY customer_id, cohort_period 
              ORDER BY period_number
              ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            ) as cumulative_revenue
          FROM customer_metrics
        )
        SELECT 
          cohort_period,
          period_number,
          COUNT(DISTINCT customer_id) as active_customers,
          ROUND(AVG(cumulative_orders)::NUMERIC, 2) as avg_cumulative_orders,
          ROUND(AVG(cumulative_revenue)::NUMERIC, 2) as avg_lifetime_value,
          ROUND(SUM(cumulative_revenue)::NUMERIC, 2) as total_cohort_value
        FROM cumulative_metrics
        GROUP BY cohort_period, period_number
        ORDER BY cohort_period, period_number
      `;

    } else {
      return NextResponse.json(
        { error: `Invalid cohort_type: ${cohort_type}` },
        { status: 400 }
      );
    }

    // Execute query
    const startTime = Date.now();
    const result = await query(sqlQuery, params);
    const executionTime = Date.now() - startTime;

    // Format results based on cohort type
    let formattedData: any = {};

    if (cohort_type === 'customer_retention') {
      // Group by cohort period
      const cohorts: Record<string, any[]> = {};
      
      result.rows.forEach(row => {
        const cohortKey = new Date(row.cohort_period).toISOString().split('T')[0];
        if (!cohorts[cohortKey]) {
          cohorts[cohortKey] = [];
        }
        cohorts[cohortKey].push({
          period_number: parseInt(row.period_number),
          customer_count: parseInt(row.customer_count),
          total_orders: parseInt(row.total_orders),
          total_revenue: parseFloat(row.total_revenue),
          initial_customers: parseInt(row.initial_customers),
          retention_rate: parseFloat(row.retention_rate)
        });
      });

      formattedData = {
        cohorts: Object.entries(cohorts).map(([period, data]) => ({
          cohort_period: period,
          periods: data,
          initial_size: data[0]?.initial_customers || 0
        }))
      };

    } else if (cohort_type === 'product_repurchase') {
      formattedData = {
        products: result.rows.map(row => ({
          product_name: row.product_name,
          category: row.category,
          cohort_period: new Date(row.cohort_period).toISOString().split('T')[0],
          purchase_period: new Date(row.purchase_period).toISOString().split('T')[0],
          repurchase_customers: parseInt(row.repurchase_customers),
          repurchase_orders: parseInt(row.repurchase_orders),
          repurchase_revenue: parseFloat(row.repurchase_revenue),
          avg_order_value: parseFloat(row.avg_order_value)
        }))
      };

    } else if (cohort_type === 'customer_lifecycle') {
      const cohorts: Record<string, any[]> = {};
      
      result.rows.forEach(row => {
        const cohortKey = new Date(row.cohort_period).toISOString().split('T')[0];
        if (!cohorts[cohortKey]) {
          cohorts[cohortKey] = [];
        }
        cohorts[cohortKey].push({
          period_number: parseInt(row.period_number),
          active_customers: parseInt(row.active_customers),
          avg_cumulative_orders: parseFloat(row.avg_cumulative_orders),
          avg_lifetime_value: parseFloat(row.avg_lifetime_value),
          total_cohort_value: parseFloat(row.total_cohort_value)
        });
      });

      formattedData = {
        cohorts: Object.entries(cohorts).map(([period, data]) => ({
          cohort_period: period,
          lifecycle_stages: data
        }))
      };
    }

    return NextResponse.json({
      cohort_analysis: {
        type: cohort_type,
        period: cohort_period,
        metric: metric,
        date_range: {
          start: start_date,
          end: end_date
        }
      },
      data: formattedData,
      metadata: {
        row_count: result.rowCount,
        execution_time_ms: executionTime
      }
    });

  } catch (error) {
    console.error('Error in cohort analysis API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
