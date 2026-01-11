import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * GET /api/supply-chain/reorder-points
 * Get reorder point rules with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get("product_id");
    const supplier_id = searchParams.get("supplier_id");
    const review_due = searchParams.get("review_due"); // 'true' to get rules needing review
    const is_active = searchParams.get("is_active");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    const conditions = ["1=1"];
    const params: any[] = [];
    let paramIndex = 1;

    if (product_id) {
      conditions.push(`rp.product_id = $${paramIndex}`);
      params.push(parseInt(product_id));
      paramIndex++;
    }

    if (supplier_id) {
      conditions.push(`rp.supplier_id = $${paramIndex}`);
      params.push(parseInt(supplier_id));
      paramIndex++;
    }

    if (review_due === "true") {
      conditions.push(`rp.next_review_date <= CURRENT_DATE`);
    }

    if (is_active !== null) {
      conditions.push(`rp.is_active = $${paramIndex}`);
      params.push(is_active === "true");
      paramIndex++;
    }

    const whereClause = conditions.join(" AND ");

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM reorder_point_rules rp WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Get reorder point rules
    params.push(limit, offset);
    const result = await query(
      `SELECT 
        rp.*,
        p.name AS product_name,
        p.sku AS product_sku,
        p.unit AS product_unit,
        s.company_name AS supplier_name,
        s.supplier_code,
        i.quantity_on_hand AS current_stock,
        CASE 
          WHEN i.quantity_on_hand <= rp.reorder_point THEN 'REORDER'
          WHEN i.quantity_on_hand <= rp.safety_stock THEN 'CRITICAL'
          ELSE 'OK'
        END AS stock_status
      FROM reorder_point_rules rp
      JOIN products p ON p.id = rp.product_id
      LEFT JOIN suppliers s ON s.id = rp.supplier_id
      LEFT JOIN inventory i ON i.product_id = rp.product_id
      WHERE ${whereClause}
      ORDER BY rp.next_review_date, p.name
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );

    return NextResponse.json({
      reorder_points: result.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching reorder points:", error);
    return NextResponse.json(
      { error: "Failed to fetch reorder points", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/supply-chain/reorder-points
 * Create a new reorder point rule
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      product_id,
      supplier_id,
      calculation_method = "dynamic",
      service_level_target = 95,
      review_period_days = 7,
      manual_reorder_point,
      manual_safety_stock,
      order_cost,
      holding_cost_percentage,
    } = body;

    if (!product_id) {
      return NextResponse.json(
        { error: "Missing required field: product_id" },
        { status: 400 }
      );
    }

    // Check for existing rule
    const existing = await query(
      `SELECT id FROM reorder_point_rules 
       WHERE product_id = $1 AND (supplier_id = $2 OR (supplier_id IS NULL AND $2 IS NULL))`,
      [product_id, supplier_id || null]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "Reorder point rule already exists for this product and supplier" },
        { status: 409 }
      );
    }

    const result = await query(
      `INSERT INTO reorder_point_rules (
        product_id, supplier_id, calculation_method, service_level_target,
        review_period_days, manual_override, manual_reorder_point, manual_safety_stock,
        order_cost, holding_cost_percentage,
        next_review_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_DATE + $5)
      RETURNING *`,
      [
        product_id,
        supplier_id || null,
        calculation_method,
        service_level_target,
        review_period_days,
        manual_reorder_point ? true : false,
        manual_reorder_point || null,
        manual_safety_stock || null,
        order_cost || null,
        holding_cost_percentage || 25,
      ]
    );

    return NextResponse.json(
      {
        message: "Reorder point rule created successfully",
        rule: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating reorder point rule:", error);
    return NextResponse.json(
      { error: "Failed to create reorder point rule", details: error.message },
      { status: 500 }
    );
  }
}
