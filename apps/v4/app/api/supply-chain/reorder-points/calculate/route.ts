import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// Z-score lookup for service levels
const Z_SCORES: Record<number, number> = {
  50: 0.0,
  75: 0.674,
  80: 0.842,
  85: 1.036,
  90: 1.282,
  95: 1.645,
  97: 1.881,
  98: 2.054,
  99: 2.326,
  99.5: 2.576,
  99.9: 3.090,
};

/**
 * POST /api/supply-chain/reorder-points/calculate
 * Auto-calculate reorder point based on historical demand and supplier performance
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      product_id,
      supplier_id,
      lookback_days = 90, // Historical data window
      service_level_target = 95,
      review_period_days = 7,
    } = body;

    if (!product_id) {
      return NextResponse.json(
        { error: "Missing required field: product_id" },
        { status: 400 }
      );
    }

    // Get product info
    const productResult = await query(
      `SELECT p.*, i.quantity_on_hand 
       FROM products p 
       LEFT JOIN inventory i ON i.product_id = p.id 
       WHERE p.id = $1`,
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = productResult.rows[0];

    // Get historical demand data from sales_order_items and work_order_materials
    const demandResult = await query(
      `SELECT 
        date_trunc('day', created_at) AS demand_date,
        SUM(quantity) AS daily_demand
      FROM (
        SELECT created_at, quantity 
        FROM sales_order_items 
        WHERE product_id = $1 
          AND created_at >= CURRENT_DATE - INTERVAL '${lookback_days} days'
        UNION ALL
        SELECT created_at, quantity_required AS quantity
        FROM work_order_materials 
        WHERE material_id = $1 
          AND created_at >= CURRENT_DATE - INTERVAL '${lookback_days} days'
      ) demand_data
      GROUP BY date_trunc('day', created_at)
      ORDER BY demand_date`,
      [product_id]
    );

    if (demandResult.rows.length < 7) {
      return NextResponse.json(
        { error: "Insufficient historical demand data (need at least 7 days)" },
        { status: 400 }
      );
    }

    // Calculate demand statistics
    const demands = demandResult.rows.map((r) => parseFloat(r.daily_demand));
    const avg_daily_demand = demands.reduce((a, b) => a + b, 0) / demands.length;
    
    // Calculate standard deviation
    const variance = demands.reduce((sum, d) => sum + Math.pow(d - avg_daily_demand, 2), 0) / demands.length;
    const demand_std_dev = Math.sqrt(variance);
    const demand_cv = avg_daily_demand > 0 ? demand_std_dev / avg_daily_demand : 0;

    // Get supplier lead time data
    let avg_lead_time_days = 14; // Default
    let lead_time_std_dev = 2; // Default
    let lead_time_cv = 0.14;

    if (supplier_id) {
      const leadTimeResult = await query(
        `SELECT 
          AVG(average_lead_time) AS avg_lead_time,
          STDDEV(average_lead_time) AS std_lead_time
        FROM supplier_performance_metrics
        WHERE supplier_id = $1
          AND period_start >= CURRENT_DATE - INTERVAL '90 days'
          AND average_lead_time IS NOT NULL`,
        [supplier_id]
      );

      if (leadTimeResult.rows.length > 0 && leadTimeResult.rows[0].avg_lead_time) {
        avg_lead_time_days = parseFloat(leadTimeResult.rows[0].avg_lead_time);
        lead_time_std_dev = parseFloat(leadTimeResult.rows[0].std_lead_time || 2);
        lead_time_cv = avg_lead_time_days > 0 ? lead_time_std_dev / avg_lead_time_days : 0;
      }
    }

    // Get Z-score for service level
    const z_score = Z_SCORES[service_level_target] || Z_SCORES[95];

    // Calculate safety stock using statistical formula
    // SS = Z × √(LT × σ²_demand + D² × σ²_LT)
    const lt_variance = Math.pow(lead_time_std_dev, 2);
    const demand_variance = Math.pow(demand_std_dev, 2);
    
    const safety_stock = z_score * Math.sqrt(
      avg_lead_time_days * demand_variance + 
      Math.pow(avg_daily_demand, 2) * lt_variance
    );

    // Calculate reorder point
    // ROP = (Average Daily Demand × Average Lead Time) + Safety Stock
    const reorder_point = (avg_daily_demand * avg_lead_time_days) + safety_stock;

    // Calculate Economic Order Quantity (EOQ) if cost data available
    let eoq = null;
    let order_cost = 50; // Default $50 per order
    let holding_cost_percentage = 25; // Default 25% annual

    // Try to get order cost from last POs
    const orderCostResult = await query(
      `SELECT AVG(shipping_cost + handling_cost) AS avg_order_cost
       FROM purchase_orders
       WHERE supplier_id = $1
         AND order_date >= CURRENT_DATE - INTERVAL '180 days'
       LIMIT 10`,
      [supplier_id || 0]
    );

    if (orderCostResult.rows.length > 0 && orderCostResult.rows[0].avg_order_cost) {
      order_cost = parseFloat(orderCostResult.rows[0].avg_order_cost);
    }

    if (product.unit_cost && product.unit_cost > 0) {
      const annual_demand = avg_daily_demand * 365;
      const holding_cost_per_unit = product.unit_cost * (holding_cost_percentage / 100);
      
      // EOQ = √((2 × Annual Demand × Order Cost) / Holding Cost per Unit)
      eoq = Math.sqrt((2 * annual_demand * order_cost) / holding_cost_per_unit);
    }

    // Check if rule exists
    const existingResult = await query(
      `SELECT id FROM reorder_point_rules 
       WHERE product_id = $1 AND (supplier_id = $2 OR (supplier_id IS NULL AND $2 IS NULL))`,
      [product_id, supplier_id || null]
    );

    let ruleId;

    if (existingResult.rows.length > 0) {
      // Update existing rule
      ruleId = existingResult.rows[0].id;
      
      await query(
        `UPDATE reorder_point_rules SET
          avg_daily_demand = $1,
          demand_std_dev = $2,
          demand_variability_coefficient = $3,
          avg_lead_time_days = $4,
          lead_time_std_dev_days = $5,
          lead_time_variability = $6,
          service_level_target = $7,
          safety_stock_quantity = $8,
          reorder_point = $9,
          order_cost = $10,
          holding_cost_percentage = $11,
          eoq = $12,
          review_period_days = $13,
          last_calculated_date = CURRENT_DATE,
          next_review_date = CURRENT_DATE + $13,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $14`,
        [
          avg_daily_demand,
          demand_std_dev,
          demand_cv,
          avg_lead_time_days,
          lead_time_std_dev,
          lead_time_cv,
          service_level_target,
          safety_stock,
          reorder_point,
          order_cost,
          holding_cost_percentage,
          eoq,
          review_period_days,
          ruleId,
        ]
      );
    } else {
      // Create new rule
      const createResult = await query(
        `INSERT INTO reorder_point_rules (
          product_id, supplier_id, calculation_method,
          avg_daily_demand, demand_std_dev, demand_variability_coefficient,
          avg_lead_time_days, lead_time_std_dev_days, lead_time_variability,
          service_level_target, safety_stock_quantity, reorder_point,
          order_cost, holding_cost_percentage, eoq,
          review_period_days, last_calculated_date, next_review_date
        ) VALUES (
          $1, $2, 'dynamic',
          $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
          CURRENT_DATE, CURRENT_DATE + $15
        ) RETURNING id`,
        [
          product_id,
          supplier_id || null,
          avg_daily_demand,
          demand_std_dev,
          demand_cv,
          avg_lead_time_days,
          lead_time_std_dev,
          lead_time_cv,
          service_level_target,
          safety_stock,
          reorder_point,
          order_cost,
          holding_cost_percentage,
          eoq,
          review_period_days,
        ]
      );
      ruleId = createResult.rows[0].id;
    }

    // Record calculation history
    await query(
      `INSERT INTO reorder_point_history (
        rule_id, calculated_date, reorder_point, safety_stock, eoq,
        avg_demand, avg_lead_time, service_level, calculation_notes
      ) VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6, $7, $8)`,
      [
        ruleId,
        reorder_point,
        safety_stock,
        eoq,
        avg_daily_demand,
        avg_lead_time_days,
        service_level_target,
        `Auto-calculated: Z=${z_score}, Demand CV=${demand_cv.toFixed(3)}, LT CV=${lead_time_cv.toFixed(3)}`,
      ]
    );

    // Fetch complete rule
    const completeResult = await query(
      `SELECT 
        rp.*,
        p.name AS product_name,
        p.sku AS product_sku,
        p.unit AS product_unit,
        s.company_name AS supplier_name,
        i.quantity_on_hand AS current_stock
      FROM reorder_point_rules rp
      JOIN products p ON p.id = rp.product_id
      LEFT JOIN suppliers s ON s.id = rp.supplier_id
      LEFT JOIN inventory i ON i.product_id = rp.product_id
      WHERE rp.id = $1`,
      [ruleId]
    );

    const rule = completeResult.rows[0];

    return NextResponse.json({
      message: "Reorder point calculated successfully",
      rule,
      calculation_details: {
        demand_analysis: {
          avg_daily_demand: avg_daily_demand.toFixed(4),
          demand_std_dev: demand_std_dev.toFixed(4),
          demand_cv: demand_cv.toFixed(4),
          data_points: demands.length,
        },
        lead_time_analysis: {
          avg_lead_time_days: avg_lead_time_days.toFixed(2),
          lead_time_std_dev: lead_time_std_dev.toFixed(2),
          lead_time_cv: lead_time_cv.toFixed(4),
        },
        safety_stock_calc: {
          service_level: service_level_target,
          z_score,
          safety_stock: safety_stock.toFixed(2),
          formula: "Z × √(LT × σ²_demand + D² × σ²_LT)",
        },
        reorder_point_calc: {
          reorder_point: reorder_point.toFixed(2),
          formula: "(Avg Daily Demand × Avg Lead Time) + Safety Stock",
        },
        eoq_calc: eoq
          ? {
              eoq: eoq.toFixed(2),
              order_cost,
              holding_cost_percentage,
              formula: "√((2 × Annual Demand × Order Cost) / Holding Cost)",
            }
          : null,
        stock_status: {
          current_stock: rule.current_stock || 0,
          reorder_needed: (rule.current_stock || 0) <= reorder_point,
          days_of_supply: avg_daily_demand > 0 ? ((rule.current_stock || 0) / avg_daily_demand).toFixed(1) : "N/A",
        },
      },
    });
  } catch (error: any) {
    console.error("Error calculating reorder point:", error);
    return NextResponse.json(
      { error: "Failed to calculate reorder point", details: error.message },
      { status: 500 }
    );
  }
}
