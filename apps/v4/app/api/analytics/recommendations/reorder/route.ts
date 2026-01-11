import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface ReorderRequest {
  warehouse_id?: number;
  product_ids?: number[];
  category?: string;
  min_stock_level?: number;
  max_recommendations?: number;
}

interface ReorderRecommendation {
  product_id: number;
  product_code: string;
  product_name: string;
  category: string;
  current_stock: number;
  reorder_point: number;
  safety_stock: number;
  lead_time_days: number;
  avg_daily_demand: number;
  recommended_order_qty: number;
  economic_order_qty: number;
  days_until_stockout: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  estimated_cost: number;
  supplier_id: number;
  supplier_name: string;
  confidence_score: number;
}

/**
 * @swagger
 * /api/analytics/recommendations/reorder:
 *   get:
 *     summary: Get inventory reorder recommendations
 *     description: AI-powered recommendations for optimal inventory reordering based on demand forecasts, lead times, and economic order quantity
 *     tags: [Prescriptive Analytics]
 *     parameters:
 *       - in: query
 *         name: warehouse_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: min_stock_level
 *         schema:
 *           type: number
 *       - in: query
 *         name: max_recommendations
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Reorder recommendations with urgency levels
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const warehouse_id = searchParams.get('warehouse_id');
    const category = searchParams.get('category');
    const min_stock_level = searchParams.get('min_stock_level');
    const max_recommendations = parseInt(searchParams.get('max_recommendations') || '50');

    const startTime = Date.now();

    // Build comprehensive reorder recommendation query
    // Uses demand forecasting, lead time analysis, and EOQ formula
    const sqlQuery = `
      WITH product_inventory AS (
        -- Get current inventory levels
        SELECT 
          p.product_id,
          p.product_code,
          p.product_name,
          p.category,
          COALESCE(i.quantity_on_hand, 0) as current_stock,
          COALESCE(i.reorder_point, 0) as reorder_point,
          COALESCE(i.safety_stock, 0) as safety_stock,
          p.supplier_id,
          s.company_name as supplier_name,
          COALESCE(s.lead_time_days, 14) as lead_time_days,
          p.unit_price,
          p.cost_price
        FROM products p
        LEFT JOIN inventory i ON p.product_id = i.product_id
        LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
        WHERE p.status = 'active'
          ${warehouse_id ? 'AND i.warehouse_id = $1' : ''}
          ${category ? `AND p.category = $${warehouse_id ? '2' : '1'}` : ''}
      ),
      demand_analysis AS (
        -- Calculate average daily demand from last 90 days
        SELECT 
          soi.product_id,
          AVG(soi.quantity) as avg_order_qty,
          COUNT(DISTINCT so.order_date) as order_days,
          SUM(soi.quantity) as total_demand_90d,
          STDDEV(soi.quantity) as demand_stddev
        FROM sales_order_items soi
        JOIN sales_orders so ON soi.order_id = so.order_id
        WHERE so.order_date >= CURRENT_DATE - INTERVAL '90 days'
          AND so.status NOT IN ('cancelled', 'rejected')
        GROUP BY soi.product_id
      ),
      demand_forecast AS (
        -- Calculate daily demand and forecast future demand
        SELECT 
          da.product_id,
          CASE 
            WHEN da.order_days > 0 THEN da.total_demand_90d / 90.0
            ELSE 0
          END as avg_daily_demand,
          COALESCE(da.demand_stddev, 0) as demand_variability,
          da.total_demand_90d
        FROM demand_analysis da
      ),
      reorder_calculations AS (
        -- Calculate reorder points and economic order quantities
        SELECT 
          pi.product_id,
          pi.product_code,
          pi.product_name,
          pi.category,
          pi.current_stock,
          pi.reorder_point,
          pi.safety_stock,
          pi.lead_time_days,
          pi.supplier_id,
          pi.supplier_name,
          pi.unit_price,
          pi.cost_price,
          COALESCE(df.avg_daily_demand, 0) as avg_daily_demand,
          df.demand_variability,
          df.total_demand_90d,
          
          -- Calculated reorder point: (avg daily demand × lead time) + safety stock
          GREATEST(
            COALESCE(pi.reorder_point, 0),
            CEIL((COALESCE(df.avg_daily_demand, 0) * pi.lead_time_days) + pi.safety_stock)
          ) as calculated_reorder_point,
          
          -- Economic Order Quantity (EOQ): sqrt(2 × annual demand × order cost / holding cost)
          -- Simplified: using sqrt(2 × 90-day demand × 100 / (cost_price × 0.25))
          CASE 
            WHEN pi.cost_price > 0 AND df.total_demand_90d > 0 THEN
              CEIL(SQRT((2.0 * df.total_demand_90d * 100) / (pi.cost_price * 0.25)))
            ELSE 50
          END as economic_order_qty,
          
          -- Days until stockout: current stock / avg daily demand
          CASE 
            WHEN df.avg_daily_demand > 0 THEN
              FLOOR(pi.current_stock / df.avg_daily_demand)
            ELSE 999
          END as days_until_stockout,
          
          -- Confidence score based on data availability
          CASE 
            WHEN df.total_demand_90d >= 10 AND pi.lead_time_days > 0 THEN 0.9
            WHEN df.total_demand_90d >= 5 THEN 0.7
            WHEN df.total_demand_90d > 0 THEN 0.5
            ELSE 0.3
          END as confidence_score
          
        FROM product_inventory pi
        LEFT JOIN demand_forecast df ON pi.product_id = df.product_id
      ),
      recommendations AS (
        -- Generate recommendations for products below reorder point
        SELECT 
          rc.*,
          
          -- Recommended order quantity (max of EOQ or amount to reach optimal stock level)
          GREATEST(
            rc.economic_order_qty,
            CEIL(rc.calculated_reorder_point + (rc.avg_daily_demand * 30) - rc.current_stock)
          ) as recommended_order_qty,
          
          -- Urgency classification
          CASE 
            WHEN rc.days_until_stockout <= 0 THEN 'critical'
            WHEN rc.days_until_stockout <= rc.lead_time_days THEN 'high'
            WHEN rc.days_until_stockout <= (rc.lead_time_days * 1.5) THEN 'medium'
            ELSE 'low'
          END as urgency,
          
          -- Priority score for sorting (lower is more urgent)
          CASE 
            WHEN rc.days_until_stockout <= 0 THEN rc.days_until_stockout
            ELSE rc.days_until_stockout - rc.lead_time_days
          END as priority_score
          
        FROM reorder_calculations rc
        WHERE 
          -- Only recommend if stock is below reorder point or will be within lead time
          (rc.current_stock <= rc.calculated_reorder_point 
           OR rc.days_until_stockout <= rc.lead_time_days)
          ${min_stock_level ? `AND rc.current_stock <= ${parseFloat(min_stock_level)}` : ''}
      )
      SELECT 
        product_id,
        product_code,
        product_name,
        category,
        current_stock,
        calculated_reorder_point as reorder_point,
        safety_stock,
        lead_time_days,
        ROUND(avg_daily_demand::NUMERIC, 2) as avg_daily_demand,
        recommended_order_qty,
        economic_order_qty,
        days_until_stockout,
        urgency,
        ROUND((recommended_order_qty * cost_price)::NUMERIC, 2) as estimated_cost,
        supplier_id,
        supplier_name,
        ROUND(confidence_score::NUMERIC, 2) as confidence_score
      FROM recommendations
      ORDER BY 
        CASE urgency
          WHEN 'critical' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          ELSE 4
        END,
        priority_score ASC,
        estimated_cost DESC
      LIMIT $${warehouse_id ? (category ? '3' : '2') : (category ? '2' : '1')}
    `;

    const params: any[] = [];
    if (warehouse_id) params.push(warehouse_id);
    if (category) params.push(category);
    params.push(max_recommendations);

    const result = await query(sqlQuery, params);
    const executionTime = Date.now() - startTime;

    const recommendations: ReorderRecommendation[] = result.rows.map(row => ({
      product_id: parseInt(row.product_id),
      product_code: row.product_code,
      product_name: row.product_name,
      category: row.category,
      current_stock: parseFloat(row.current_stock),
      reorder_point: parseFloat(row.reorder_point),
      safety_stock: parseFloat(row.safety_stock),
      lead_time_days: parseInt(row.lead_time_days),
      avg_daily_demand: parseFloat(row.avg_daily_demand),
      recommended_order_qty: parseInt(row.recommended_order_qty),
      economic_order_qty: parseInt(row.economic_order_qty),
      days_until_stockout: parseInt(row.days_until_stockout),
      urgency: row.urgency,
      estimated_cost: parseFloat(row.estimated_cost),
      supplier_id: parseInt(row.supplier_id),
      supplier_name: row.supplier_name,
      confidence_score: parseFloat(row.confidence_score)
    }));

    // Calculate summary statistics
    const summary = {
      total_recommendations: recommendations.length,
      critical_count: recommendations.filter(r => r.urgency === 'critical').length,
      high_count: recommendations.filter(r => r.urgency === 'high').length,
      medium_count: recommendations.filter(r => r.urgency === 'medium').length,
      low_count: recommendations.filter(r => r.urgency === 'low').length,
      total_estimated_cost: recommendations.reduce((sum, r) => sum + r.estimated_cost, 0),
      avg_confidence_score: recommendations.length > 0
        ? recommendations.reduce((sum, r) => sum + r.confidence_score, 0) / recommendations.length
        : 0
    };

    return NextResponse.json({
      recommendations,
      summary: {
        ...summary,
        total_estimated_cost: parseFloat(summary.total_estimated_cost.toFixed(2)),
        avg_confidence_score: parseFloat(summary.avg_confidence_score.toFixed(2))
      },
      filters: {
        warehouse_id: warehouse_id ? parseInt(warehouse_id) : null,
        category: category || null,
        min_stock_level: min_stock_level ? parseFloat(min_stock_level) : null
      },
      metadata: {
        execution_time_ms: executionTime,
        generated_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in reorder recommendations API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint to accept or schedule a reorder recommendation
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, quantity, supplier_id, notes, scheduled_date } = body;

    if (!product_id || !quantity || !supplier_id) {
      return NextResponse.json(
        { error: 'product_id, quantity, and supplier_id are required' },
        { status: 400 }
      );
    }

    // Create purchase order from recommendation
    const createPOQuery = `
      INSERT INTO purchase_orders (
        supplier_id,
        order_date,
        expected_delivery_date,
        status,
        notes
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING purchase_order_id
    `;

    const orderDate = scheduled_date ? new Date(scheduled_date) : new Date();
    const expectedDelivery = new Date(orderDate);
    expectedDelivery.setDate(expectedDelivery.getDate() + 14); // Default 14 days lead time

    const poResult = await query(createPOQuery, [
      supplier_id,
      orderDate,
      expectedDelivery,
      'pending',
      notes || 'Auto-generated from reorder recommendation'
    ]);

    const purchaseOrderId = poResult.rows[0].purchase_order_id;

    // Add line item
    const createLineItemQuery = `
      INSERT INTO purchase_order_items (
        purchase_order_id,
        product_id,
        quantity,
        unit_price
      )
      SELECT $1, $2, $3, p.cost_price
      FROM products p
      WHERE p.product_id = $2
      RETURNING *
    `;

    await query(createLineItemQuery, [purchaseOrderId, product_id, quantity]);

    return NextResponse.json({
      success: true,
      purchase_order_id: purchaseOrderId,
      message: 'Purchase order created from recommendation'
    });

  } catch (error) {
    console.error('Error creating purchase order from recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to create purchase order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
