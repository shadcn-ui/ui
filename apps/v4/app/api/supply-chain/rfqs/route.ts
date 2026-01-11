import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * GET /api/supply-chain/rfqs
 * Get RFQs with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const created_by = searchParams.get("created_by");
    const deadline_soon = searchParams.get("deadline_soon"); // 'true' for deadline within 7 days
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const conditions = ["1=1"];
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`r.status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (created_by) {
      conditions.push(`r.created_by = $${paramIndex}`);
      params.push(parseInt(created_by));
      paramIndex++;
    }

    if (deadline_soon === "true") {
      conditions.push(`r.response_deadline <= CURRENT_DATE + INTERVAL '7 days'`);
      conditions.push(`r.response_deadline >= CURRENT_DATE`);
    }

    const whereClause = conditions.join(" AND ");

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM rfq_requests r WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Get RFQs
    params.push(limit, offset);
    const result = await query(
      `SELECT 
        r.*,
        u.name AS created_by_name,
        COUNT(DISTINCT rs.supplier_id) AS invited_suppliers_count,
        COUNT(DISTINCT sq.id) AS quotes_received_count,
        COUNT(DISTINCT ri.id) AS item_count,
        CASE 
          WHEN r.response_deadline < CURRENT_DATE THEN 'Overdue'
          WHEN r.response_deadline <= CURRENT_DATE + 3 THEN 'Due Soon'
          ELSE 'On Track'
        END AS deadline_status
      FROM rfq_requests r
      LEFT JOIN users u ON u.id = r.created_by
      LEFT JOIN rfq_suppliers rs ON rs.rfq_id = r.id
      LEFT JOIN supplier_quotations sq ON sq.rfq_id = r.id
      LEFT JOIN rfq_items ri ON ri.rfq_id = r.id
      WHERE ${whereClause}
      GROUP BY r.id, u.name
      ORDER BY r.response_deadline, r.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );

    return NextResponse.json({
      rfqs: result.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching RFQs:", error);
    return NextResponse.json(
      { error: "Failed to fetch RFQs", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/supply-chain/rfqs
 * Create a new RFQ
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      response_deadline,
      terms_and_conditions,
      created_by,
      pr_id,
      items, // Array of {product_id, description, quantity, unit, specifications, notes}
      auto_invite_suppliers = false,
      min_supplier_score = 70,
    } = body;

    if (!title || !response_deadline || !created_by) {
      return NextResponse.json(
        { error: "Missing required fields: title, response_deadline, created_by" },
        { status: 400 }
      );
    }

    // Generate RFQ number
    const numberResult = await query(
      `SELECT 'RFQ-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || 
       LPAD((COUNT(*) + 1)::TEXT, 4, '0') AS rfq_number
       FROM rfq_requests 
       WHERE issue_date = CURRENT_DATE`
    );
    const rfq_number = numberResult.rows[0].rfq_number;

    // Create RFQ
    const rfqResult = await query(
      `INSERT INTO rfq_requests (
        rfq_number, title, description, response_deadline,
        terms_and_conditions, created_by, pr_id, status, issue_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'draft', CURRENT_DATE)
      RETURNING *`,
      [rfq_number, title, description, response_deadline, terms_and_conditions, created_by, pr_id]
    );

    const rfq = rfqResult.rows[0];

    // Add items if provided
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await query(
          `INSERT INTO rfq_items (
            rfq_id, product_id, description, quantity, unit, specifications, notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            rfq.id,
            item.product_id || null,
            item.description,
            item.quantity,
            item.unit || 'EA',
            item.specifications || null,
            item.notes || null,
          ]
        );
      }
    }

    // Auto-invite suppliers based on scorecard if requested
    if (auto_invite_suppliers) {
      const suppliersResult = await query(
        `SELECT DISTINCT s.id
         FROM suppliers s
         LEFT JOIN supplier_scorecards sc ON sc.supplier_id = s.id
           AND sc.status = 'final'
         WHERE s.status = 'Active'
           AND (sc.overall_score >= $1 OR sc.overall_score IS NULL)
         LIMIT 10`,
        [min_supplier_score]
      );

      for (const supplier of suppliersResult.rows) {
        await query(
          `INSERT INTO rfq_suppliers (rfq_id, supplier_id, status)
           VALUES ($1, $2, 'pending')
           ON CONFLICT (rfq_id, supplier_id) DO NOTHING`,
          [rfq.id, supplier.id]
        );
      }
    }

    // Fetch complete RFQ
    const completeResult = await query(
      `SELECT 
        r.*,
        u.name AS created_by_name,
        (
          SELECT json_agg(
            json_build_object(
              'id', ri.id,
              'product_id', ri.product_id,
              'description', ri.description,
              'quantity', ri.quantity,
              'unit', ri.unit,
              'specifications', ri.specifications,
              'notes', ri.notes
            )
          )
          FROM rfq_items ri
          WHERE ri.rfq_id = r.id
        ) AS items,
        (
          SELECT json_agg(
            json_build_object(
              'supplier_id', rs.supplier_id,
              'supplier_name', s.company_name,
              'status', rs.status
            )
          )
          FROM rfq_suppliers rs
          JOIN suppliers s ON s.id = rs.supplier_id
          WHERE rs.rfq_id = r.id
        ) AS invited_suppliers
      FROM rfq_requests r
      LEFT JOIN users u ON u.id = r.created_by
      WHERE r.id = $1`,
      [rfq.id]
    );

    return NextResponse.json(
      {
        message: "RFQ created successfully",
        rfq: completeResult.rows[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating RFQ:", error);
    return NextResponse.json(
      { error: "Failed to create RFQ", details: error.message },
      { status: 500 }
    );
  }
}
