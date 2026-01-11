import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * GET /api/supply-chain/contracts
 * Get supplier contracts with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const supplier_id = searchParams.get("supplier_id");
    const status = searchParams.get("status");
    const expiring_soon = searchParams.get("expiring_soon"); // days
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const conditions = ["1=1"];
    const params: any[] = [];
    let paramIndex = 1;

    if (supplier_id) {
      conditions.push(`sc.supplier_id = $${paramIndex}`);
      params.push(parseInt(supplier_id));
      paramIndex++;
    }

    if (status) {
      conditions.push(`sc.status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (expiring_soon) {
      conditions.push(`sc.end_date <= CURRENT_DATE + INTERVAL '${expiring_soon} days'`);
      conditions.push(`sc.end_date >= CURRENT_DATE`);
      conditions.push(`sc.status = 'active'`);
    }

    const whereClause = conditions.join(" AND ");

    const countResult = await query(
      `SELECT COUNT(*) as total FROM supplier_contracts sc WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    params.push(limit, offset);
    const result = await query(
      `SELECT 
        sc.*,
        s.company_name AS supplier_name,
        s.supplier_code,
        CASE 
          WHEN sc.end_date < CURRENT_DATE THEN 'Expired'
          WHEN sc.end_date <= CURRENT_DATE + 30 THEN 'Expiring Soon'
          ELSE 'Active'
        END AS expiry_status,
        (sc.end_date - CURRENT_DATE) AS days_until_expiry,
        (
          SELECT COUNT(*) 
          FROM purchase_orders po 
          WHERE po.supplier_id = sc.supplier_id
            AND po.order_date >= sc.start_date
            AND po.order_date <= sc.end_date
        ) AS po_count,
        (
          SELECT COALESCE(SUM(po.total_amount), 0)
          FROM purchase_orders po
          WHERE po.supplier_id = sc.supplier_id
            AND po.order_date >= sc.start_date
            AND po.order_date <= sc.end_date
        ) AS total_spend
      FROM supplier_contracts sc
      JOIN suppliers s ON s.id = sc.supplier_id
      WHERE ${whereClause}
      ORDER BY sc.end_date
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );

    return NextResponse.json({
      contracts: result.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching contracts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contracts", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/supply-chain/contracts
 * Create a new supplier contract
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      contract_number,
      contract_name,
      supplier_id,
      contract_type = "blanket",
      start_date,
      end_date,
      auto_renew = false,
      renewal_notice_days = 90,
      total_contract_value,
      minimum_order_value,
      currency = "USD",
      payment_terms,
      delivery_terms,
      warranty_terms,
      created_by,
      pricing, // Array of {product_id, unit_price, min_quantity, max_quantity, valid_from, valid_to}
    } = body;

    if (!contract_name || !supplier_id || !start_date || !end_date || !created_by) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate contract number if not provided
    let finalContractNumber = contract_number;
    if (!finalContractNumber) {
      const numberResult = await query(
        `SELECT 'CNT-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || 
         LPAD((COUNT(*) + 1)::TEXT, 4, '0') AS contract_number
         FROM supplier_contracts 
         WHERE DATE(created_at) = CURRENT_DATE`
      );
      finalContractNumber = numberResult.rows[0].contract_number;
    }

    const contractResult = await query(
      `INSERT INTO supplier_contracts (
        contract_number, contract_name, supplier_id, contract_type,
        start_date, end_date, auto_renew, renewal_notice_days,
        total_contract_value, minimum_order_value, currency,
        payment_terms, delivery_terms, warranty_terms,
        status, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'active', $15)
      RETURNING *`,
      [
        finalContractNumber,
        contract_name,
        supplier_id,
        contract_type,
        start_date,
        end_date,
        auto_renew,
        renewal_notice_days,
        total_contract_value,
        minimum_order_value,
        currency,
        payment_terms,
        delivery_terms,
        warranty_terms,
        created_by,
      ]
    );

    const contract = contractResult.rows[0];

    // Add pricing if provided
    if (pricing && pricing.length > 0) {
      for (const price of pricing) {
        await query(
          `INSERT INTO contract_pricing (
            contract_id, product_id, unit_price, min_quantity, max_quantity,
            valid_from, valid_to, currency
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            contract.id,
            price.product_id,
            price.unit_price,
            price.min_quantity || null,
            price.max_quantity || null,
            price.valid_from || start_date,
            price.valid_to || end_date,
            currency,
          ]
        );
      }
    }

    return NextResponse.json(
      {
        message: "Contract created successfully",
        contract,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating contract:", error);
    return NextResponse.json(
      { error: "Failed to create contract", details: error.message },
      { status: 500 }
    );
  }
}
