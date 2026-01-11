import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface FunnelRequest {
  funnel_type: 'sales_pipeline' | 'order_fulfillment' | 'customer_journey';
  start_date: string;
  end_date: string;
  filters?: Record<string, any>;
}

/**
 * @swagger
 * /api/analytics/bi/funnels:
 *   post:
 *     summary: Generate conversion funnel analysis
 *     description: Track conversion rates through sales, fulfillment, and customer journey stages
 *     tags: [Business Intelligence]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - funnel_type
 *               - start_date
 *               - end_date
 *             properties:
 *               funnel_type:
 *                 type: string
 *                 enum: [sales_pipeline, order_fulfillment, customer_journey]
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
 *         description: Funnel analysis data
 */
export async function POST(request: Request) {
  try {
    const body: FunnelRequest = await request.json();
    
    const {
      funnel_type,
      start_date,
      end_date,
      filters = {}
    } = body;

    // Validate required fields
    if (!funnel_type || !start_date || !end_date) {
      return NextResponse.json(
        { error: 'funnel_type, start_date, and end_date are required' },
        { status: 400 }
      );
    }

    let stages: any[] = [];
    let sqlQuery = '';
    const params: any[] = [start_date, end_date];

    if (funnel_type === 'sales_pipeline') {
      // Sales Pipeline Funnel: Lead → Quotation → Order → Completed
      
      sqlQuery = `
        WITH date_range AS (
          SELECT $1::DATE as start_date, $2::DATE as end_date
        ),
        stage_leads AS (
          SELECT 
            'Leads' as stage,
            1 as stage_order,
            COUNT(*) as count,
            SUM(estimated_value) as value
          FROM leads
          WHERE created_at::DATE BETWEEN (SELECT start_date FROM date_range) AND (SELECT end_date FROM date_range)
        ),
        stage_quotations AS (
          SELECT 
            'Quotations' as stage,
            2 as stage_order,
            COUNT(*) as count,
            SUM(total_amount) as value
          FROM quotations
          WHERE created_at::DATE BETWEEN (SELECT start_date FROM date_range) AND (SELECT end_date FROM date_range)
        ),
        stage_orders AS (
          SELECT 
            'Orders' as stage,
            3 as stage_order,
            COUNT(*) as count,
            SUM(total_amount) as value
          FROM sales_orders
          WHERE order_date BETWEEN (SELECT start_date FROM date_range) AND (SELECT end_date FROM date_range)
        ),
        stage_completed AS (
          SELECT 
            'Completed' as stage,
            4 as stage_order,
            COUNT(*) as count,
            SUM(total_amount) as value
          FROM sales_orders
          WHERE order_date BETWEEN (SELECT start_date FROM date_range) AND (SELECT end_date FROM date_range)
            AND status = 'completed'
        )
        SELECT * FROM stage_leads
        UNION ALL SELECT * FROM stage_quotations
        UNION ALL SELECT * FROM stage_orders
        UNION ALL SELECT * FROM stage_completed
        ORDER BY stage_order
      `;

    } else if (funnel_type === 'order_fulfillment') {
      // Order Fulfillment Funnel: Pending → Processing → Shipped → Delivered
      
      sqlQuery = `
        WITH date_range AS (
          SELECT $1::DATE as start_date, $2::DATE as end_date
        ),
        all_orders AS (
          SELECT 
            order_id,
            status,
            total_amount,
            order_date,
            shipped_date,
            delivery_date
          FROM sales_orders
          WHERE order_date BETWEEN (SELECT start_date FROM date_range) AND (SELECT end_date FROM date_range)
        ),
        stage_pending AS (
          SELECT 
            'Pending' as stage,
            1 as stage_order,
            COUNT(*) as count,
            SUM(total_amount) as value,
            ROUND(AVG(EXTRACT(EPOCH FROM (COALESCE(shipped_date, CURRENT_TIMESTAMP) - order_date)) / 3600)::NUMERIC, 2) as avg_hours
          FROM all_orders
        ),
        stage_processing AS (
          SELECT 
            'Processing' as stage,
            2 as stage_order,
            COUNT(*) as count,
            SUM(total_amount) as value,
            ROUND(AVG(EXTRACT(EPOCH FROM (COALESCE(shipped_date, CURRENT_TIMESTAMP) - order_date)) / 3600)::NUMERIC, 2) as avg_hours
          FROM all_orders
          WHERE status IN ('processing', 'shipped', 'delivered', 'completed')
        ),
        stage_shipped AS (
          SELECT 
            'Shipped' as stage,
            3 as stage_order,
            COUNT(*) as count,
            SUM(total_amount) as value,
            ROUND(AVG(EXTRACT(EPOCH FROM (COALESCE(delivery_date, CURRENT_TIMESTAMP) - shipped_date)) / 3600)::NUMERIC, 2) as avg_hours
          FROM all_orders
          WHERE shipped_date IS NOT NULL
        ),
        stage_delivered AS (
          SELECT 
            'Delivered' as stage,
            4 as stage_order,
            COUNT(*) as count,
            SUM(total_amount) as value,
            ROUND(AVG(EXTRACT(EPOCH FROM (delivery_date - shipped_date)) / 3600)::NUMERIC, 2) as avg_hours
          FROM all_orders
          WHERE delivery_date IS NOT NULL
        )
        SELECT * FROM stage_pending
        UNION ALL SELECT * FROM stage_processing
        UNION ALL SELECT * FROM stage_shipped
        UNION ALL SELECT * FROM stage_delivered
        ORDER BY stage_order
      `;

    } else if (funnel_type === 'customer_journey') {
      // Customer Journey Funnel: New Customer → First Order → Repeat Customer → Loyal Customer
      
      sqlQuery = `
        WITH date_range AS (
          SELECT $1::DATE as start_date, $2::DATE as end_date
        ),
        new_customers AS (
          SELECT DISTINCT customer_id
          FROM sales_orders
          WHERE order_date BETWEEN (SELECT start_date FROM date_range) AND (SELECT end_date FROM date_range)
        ),
        customer_orders AS (
          SELECT 
            customer_id,
            COUNT(*) as order_count,
            SUM(total_amount) as total_spent,
            MIN(order_date) as first_order_date,
            MAX(order_date) as last_order_date
          FROM sales_orders
          WHERE status = 'completed'
          GROUP BY customer_id
        ),
        stage_new AS (
          SELECT 
            'New Customers' as stage,
            1 as stage_order,
            COUNT(DISTINCT nc.customer_id) as count,
            0 as value
          FROM new_customers nc
        ),
        stage_first_order AS (
          SELECT 
            'First Order' as stage,
            2 as stage_order,
            COUNT(DISTINCT nc.customer_id) as count,
            COALESCE(SUM(co.total_spent), 0) as value
          FROM new_customers nc
          JOIN customer_orders co ON nc.customer_id = co.customer_id
          WHERE co.order_count >= 1
        ),
        stage_repeat AS (
          SELECT 
            'Repeat Customers' as stage,
            3 as stage_order,
            COUNT(DISTINCT nc.customer_id) as count,
            COALESCE(SUM(co.total_spent), 0) as value
          FROM new_customers nc
          JOIN customer_orders co ON nc.customer_id = co.customer_id
          WHERE co.order_count >= 2
        ),
        stage_loyal AS (
          SELECT 
            'Loyal Customers' as stage,
            4 as stage_order,
            COUNT(DISTINCT nc.customer_id) as count,
            COALESCE(SUM(co.total_spent), 0) as value
          FROM new_customers nc
          JOIN customer_orders co ON nc.customer_id = co.customer_id
          WHERE co.order_count >= 5
        )
        SELECT * FROM stage_new
        UNION ALL SELECT * FROM stage_first_order
        UNION ALL SELECT * FROM stage_repeat
        UNION ALL SELECT * FROM stage_loyal
        ORDER BY stage_order
      `;

    } else {
      return NextResponse.json(
        { error: `Invalid funnel_type: ${funnel_type}` },
        { status: 400 }
      );
    }

    // Execute query
    const startTime = Date.now();
    const result = await query(sqlQuery, params);
    const executionTime = Date.now() - startTime;

    // Calculate conversion rates
    let previousCount = 0;
    stages = result.rows.map((row, index) => {
      const count = parseInt(row.count);
      const value = parseFloat(row.value) || 0;
      
      const conversionRate = index === 0 || previousCount === 0 
        ? 100 
        : (count / previousCount * 100);
      
      const dropoffRate = 100 - conversionRate;
      const dropoffCount = index === 0 ? 0 : previousCount - count;
      
      previousCount = count;
      
      return {
        stage: row.stage,
        stage_order: parseInt(row.stage_order),
        count: count,
        value: value,
        avg_hours: row.avg_hours ? parseFloat(row.avg_hours) : undefined,
        conversion_rate: parseFloat(conversionRate.toFixed(2)),
        dropoff_rate: parseFloat(dropoffRate.toFixed(2)),
        dropoff_count: dropoffCount
      };
    });

    // Calculate overall funnel metrics
    const firstStage = stages[0];
    const lastStage = stages[stages.length - 1];
    
    const overallConversion = firstStage && firstStage.count > 0
      ? (lastStage.count / firstStage.count * 100)
      : 0;
    
    const totalDropoff = firstStage ? firstStage.count - lastStage.count : 0;

    return NextResponse.json({
      funnel: {
        type: funnel_type,
        date_range: {
          start: start_date,
          end: end_date
        }
      },
      stages: stages,
      summary: {
        total_entered: firstStage?.count || 0,
        total_completed: lastStage?.count || 0,
        overall_conversion_rate: parseFloat(overallConversion.toFixed(2)),
        total_dropoff: totalDropoff,
        total_value: stages.reduce((sum, s) => sum + s.value, 0)
      },
      metadata: {
        stage_count: stages.length,
        execution_time_ms: executionTime
      }
    });

  } catch (error) {
    console.error('Error in funnel analysis API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
