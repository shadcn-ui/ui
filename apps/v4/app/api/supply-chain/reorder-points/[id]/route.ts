import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * GET /api/supply-chain/reorder-points/[id]
 * Get a specific reorder point rule
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const routeParams = await context.params;
    const ruleId = parseInt(routeParams.id);

    const result = await query(
      `SELECT 
        rp.*,
        p.name AS product_name,
        p.sku AS product_sku,
        p.unit AS product_unit,
        p.unit_cost,
        s.company_name AS supplier_name,
        s.supplier_code,
        i.quantity_on_hand AS current_stock,
        (
          SELECT json_agg(
            json_build_object(
              'calculated_date', h.calculated_date,
              'reorder_point', h.reorder_point,
              'safety_stock', h.safety_stock,
              'eoq', h.eoq,
              'avg_demand', h.avg_demand,
              'avg_lead_time', h.avg_lead_time
            ) ORDER BY h.calculated_date DESC
          )
          FROM reorder_point_history h
          WHERE h.rule_id = rp.id
          LIMIT 30
        ) AS calculation_history
      FROM reorder_point_rules rp
      JOIN products p ON p.id = rp.product_id
      LEFT JOIN suppliers s ON s.id = rp.supplier_id
      LEFT JOIN inventory i ON i.product_id = rp.product_id
      WHERE rp.id = $1`,
      [ruleId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Reorder point rule not found" }, { status: 404 });
    }

    return NextResponse.json({ rule: result.rows[0] });
  } catch (error: any) {
    console.error("Error fetching reorder point rule:", error);
    return NextResponse.json(
      { error: "Failed to fetch reorder point rule", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/supply-chain/reorder-points/[id]
 * Update a reorder point rule
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const routeParams = await context.params;
    const ruleId = parseInt(routeParams.id);
    const body = await request.json();

    const {
      calculation_method,
      service_level_target,
      review_period_days,
      manual_override,
      manual_reorder_point,
      manual_safety_stock,
      override_reason,
      override_by,
      order_cost,
      holding_cost_percentage,
      is_active,
    } = body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (calculation_method) {
      updates.push(`calculation_method = $${paramIndex}`);
      values.push(calculation_method);
      paramIndex++;
    }

    if (service_level_target !== undefined) {
      updates.push(`service_level_target = $${paramIndex}`);
      values.push(service_level_target);
      paramIndex++;
    }

    if (review_period_days !== undefined) {
      updates.push(`review_period_days = $${paramIndex}`);
      values.push(review_period_days);
      paramIndex++;
    }

    if (manual_override !== undefined) {
      updates.push(`manual_override = $${paramIndex}`);
      values.push(manual_override);
      paramIndex++;
    }

    if (manual_reorder_point !== undefined) {
      updates.push(`manual_reorder_point = $${paramIndex}`);
      values.push(manual_reorder_point);
      paramIndex++;
    }

    if (manual_safety_stock !== undefined) {
      updates.push(`manual_safety_stock = $${paramIndex}`);
      values.push(manual_safety_stock);
      paramIndex++;
    }

    if (override_reason) {
      updates.push(`override_reason = $${paramIndex}`);
      values.push(override_reason);
      paramIndex++;
    }

    if (override_by) {
      updates.push(`override_by = $${paramIndex}, override_date = CURRENT_DATE`);
      values.push(override_by);
      paramIndex++;
    }

    if (order_cost !== undefined) {
      updates.push(`order_cost = $${paramIndex}`);
      values.push(order_cost);
      paramIndex++;
    }

    if (holding_cost_percentage !== undefined) {
      updates.push(`holding_cost_percentage = $${paramIndex}`);
      values.push(holding_cost_percentage);
      paramIndex++;
    }

    if (is_active !== undefined) {
      updates.push(`is_active = $${paramIndex}`);
      values.push(is_active);
      paramIndex++;
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(ruleId);

    await query(
      `UPDATE reorder_point_rules SET ${updates.join(", ")} WHERE id = $${paramIndex}`,
      values
    );

    // Fetch updated rule
    const result = await query(
      `SELECT 
        rp.*,
        p.name AS product_name,
        p.sku AS product_sku,
        s.company_name AS supplier_name
      FROM reorder_point_rules rp
      JOIN products p ON p.id = rp.product_id
      LEFT JOIN suppliers s ON s.id = rp.supplier_id
      WHERE rp.id = $1`,
      [ruleId]
    );

    return NextResponse.json({
      message: "Reorder point rule updated successfully",
      rule: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error updating reorder point rule:", error);
    return NextResponse.json(
      { error: "Failed to update reorder point rule", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/supply-chain/reorder-points/[id]
 * Delete a reorder point rule
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const routeParams = await context.params;
    const ruleId = parseInt(routeParams.id);

    await query(`DELETE FROM reorder_point_rules WHERE id = $1`, [ruleId]);

    return NextResponse.json({ message: "Reorder point rule deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting reorder point rule:", error);
    return NextResponse.json(
      { error: "Failed to delete reorder point rule", details: error.message },
      { status: 500 }
    );
  }
}
