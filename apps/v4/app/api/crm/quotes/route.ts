// Phase 7 Task 2: Quotes API
// GET/POST /api/crm/quotes

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://mac@localhost:5432/ocean-erp",
});

// GET /api/crm/quotes - List quotes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;
    
    const opportunityId = searchParams.get("opportunity_id");
    const accountId = searchParams.get("account_id");
    const status = searchParams.get("status");

    let query = `
      SELECT 
        q.*,
        o.opportunity_name,
        o.opportunity_number,
        a.account_name,
        a.account_number,
        c.full_name as contact_name,
        (SELECT COUNT(*) FROM crm_quote_line_items WHERE quote_id = q.quote_id) as line_item_count
      FROM crm_quotes q
      JOIN crm_opportunities o ON q.opportunity_id = o.opportunity_id
      JOIN crm_accounts a ON q.account_id = a.account_id
      LEFT JOIN crm_contacts c ON q.contact_id = c.contact_id
      WHERE q.is_active = true
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (opportunityId) {
      query += ` AND q.opportunity_id = $${paramIndex}`;
      params.push(parseInt(opportunityId));
      paramIndex++;
    }

    if (accountId) {
      query += ` AND q.account_id = $${paramIndex}`;
      params.push(parseInt(accountId));
      paramIndex++;
    }

    if (status) {
      query += ` AND q.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as filtered`;
    const countResult = await pool.query(countQuery, params);
    const totalRecords = parseInt(countResult.rows[0].total);

    // Add pagination
    query += ` ORDER BY q.quote_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total_records: totalRecords,
        total_pages: Math.ceil(totalRecords / limit),
      },
      metadata: {
        execution_time_ms: Date.now(),
        generated_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("CRM Quotes API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch quotes",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/crm/quotes - Create new quote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["opportunity_id", "account_id", "quote_name"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          missing_fields: missingFields,
        },
        { status: 400 }
      );
    }

    // Generate quote number
    const numberResult = await pool.query(
      "SELECT COALESCE(MAX(CAST(SUBSTRING(quote_number FROM 4) AS INTEGER)), 0) + 1 as next_num FROM crm_quotes WHERE quote_number LIKE 'QT-%'"
    );
    const quoteNumber = `QT-${String(numberResult.rows[0].next_num).padStart(6, '0')}`;

    // Get latest version for this opportunity
    const versionResult = await pool.query(
      "SELECT COALESCE(MAX(version), 0) + 1 as next_version FROM crm_quotes WHERE opportunity_id = $1",
      [body.opportunity_id]
    );
    const version = versionResult.rows[0].next_version;

    // Insert quote
    const query = `
      INSERT INTO crm_quotes (
        quote_number,
        opportunity_id,
        account_id,
        contact_id,
        quote_name,
        version,
        status,
        quote_date,
        valid_until,
        payment_terms,
        delivery_terms,
        notes,
        terms_and_conditions,
        owner_id,
        created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15
      )
      RETURNING *
    `;

    const params = [
      quoteNumber,
      body.opportunity_id,
      body.account_id,
      body.contact_id || null,
      body.quote_name,
      version,
      body.status || 'draft',
      body.quote_date || new Date().toISOString().split('T')[0],
      body.valid_until || null,
      body.payment_terms || null,
      body.delivery_terms || null,
      body.notes || null,
      body.terms_and_conditions || null,
      body.owner_id || null,
      body.created_by || null,
    ];

    const result = await pool.query(query, params);
    const quoteId = result.rows[0].quote_id;

    // Insert line items if provided
    if (body.line_items && Array.isArray(body.line_items)) {
      let subtotal = 0;

      for (let i = 0; i < body.line_items.length; i++) {
        const item = body.line_items[i];
        const lineTotal = (item.quantity * item.unit_price) - (item.discount_amount || 0);

        await pool.query(
          `
          INSERT INTO crm_quote_line_items (
            quote_id, product_id, line_number, product_code, product_name,
            description, quantity, unit_price, discount_percent, discount_amount,
            tax_percent, tax_amount, line_total
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `,
          [
            quoteId,
            item.product_id || null,
            i + 1,
            item.product_code || null,
            item.product_name,
            item.description || null,
            item.quantity,
            item.unit_price,
            item.discount_percent || 0,
            item.discount_amount || 0,
            item.tax_percent || 0,
            item.tax_amount || 0,
            lineTotal,
          ]
        );

        subtotal += lineTotal;
      }

      // Update quote totals
      const taxAmount = subtotal * ((body.tax_percent || 0) / 100);
      const total = subtotal + taxAmount + (body.shipping_amount || 0) - (body.discount_amount || 0);

      await pool.query(
        `
        UPDATE crm_quotes 
        SET subtotal = $1, 
            discount_amount = $2, 
            tax_percent = $3, 
            tax_amount = $4, 
            shipping_amount = $5, 
            total_amount = $6
        WHERE quote_id = $7
      `,
        [
          subtotal,
          body.discount_amount || 0,
          body.tax_percent || 0,
          taxAmount,
          body.shipping_amount || 0,
          total,
          quoteId,
        ]
      );
    }

    // Get complete quote with line items
    const detailQuery = `
      SELECT 
        q.*,
        o.opportunity_name,
        a.account_name,
        c.full_name as contact_name
      FROM crm_quotes q
      JOIN crm_opportunities o ON q.opportunity_id = o.opportunity_id
      JOIN crm_accounts a ON q.account_id = a.account_id
      LEFT JOIN crm_contacts c ON q.contact_id = c.contact_id
      WHERE q.quote_id = $1
    `;

    const detailResult = await pool.query(detailQuery, [quoteId]);

    const lineItemsQuery = `
      SELECT * FROM crm_quote_line_items 
      WHERE quote_id = $1 
      ORDER BY line_number
    `;

    const lineItemsResult = await pool.query(lineItemsQuery, [quoteId]);

    return NextResponse.json(
      {
        success: true,
        data: {
          ...detailResult.rows[0],
          line_items: lineItemsResult.rows,
        },
        message: "Quote created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create Quote Error:", error);

    if (error.code === "23503") {
      return NextResponse.json(
        {
          success: false,
          error: "Referenced opportunity or account does not exist",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create quote",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
