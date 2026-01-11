// Phase 7 Task 1: CRM Accounts API
// GET/POST /api/crm/accounts

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://mac@localhost:5432/ocean-erp",
});

// GET /api/crm/accounts - List all accounts with filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;
    
    // Filters
    const accountType = searchParams.get("account_type");
    const customerTypeId = searchParams.get("customer_type_id");
    const industry = searchParams.get("industry");
    const rating = searchParams.get("rating");
    const isActive = searchParams.get("is_active");
    const search = searchParams.get("search");

    let query = `
      SELECT 
        a.*,
        ct.type_name as customer_type_name,
        (SELECT COUNT(*) FROM crm_contacts WHERE account_id = a.account_id AND is_active = true) as contact_count,
        (SELECT COUNT(*) FROM crm_communication_log WHERE account_id = a.account_id) as communication_count,
        (SELECT MAX(communication_date) FROM crm_communication_log WHERE account_id = a.account_id) as last_contact_date,
        p.account_name as parent_account_name
      FROM crm_accounts a
      LEFT JOIN crm_customer_types ct ON a.customer_type_id = ct.customer_type_id
      LEFT JOIN crm_accounts p ON a.parent_account_id = p.account_id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (accountType) {
      query += ` AND a.account_type = $${paramIndex}`;
      params.push(accountType);
      paramIndex++;
    }

    if (customerTypeId) {
      query += ` AND a.customer_type_id = $${paramIndex}`;
      params.push(parseInt(customerTypeId));
      paramIndex++;
    }

    if (industry) {
      query += ` AND a.industry = $${paramIndex}`;
      params.push(industry);
      paramIndex++;
    }

    if (rating) {
      query += ` AND a.rating = $${paramIndex}`;
      params.push(rating);
      paramIndex++;
    }

    if (isActive !== null && isActive !== undefined) {
      query += ` AND a.is_active = $${paramIndex}`;
      params.push(isActive === "true");
      paramIndex++;
    }

    if (search) {
      query += ` AND (
        a.account_name ILIKE $${paramIndex} OR
        a.account_number ILIKE $${paramIndex} OR
        a.website ILIKE $${paramIndex}
      )`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as filtered`;
    const countResult = await pool.query(countQuery, params);
    const totalRecords = parseInt(countResult.rows[0].total);

    // Add pagination
    query += ` ORDER BY a.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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
    console.error("CRM Accounts API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch accounts",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/crm/accounts - Create new account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["account_name", "account_type"];
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

    // Generate account number if not provided
    let accountNumber = body.account_number;
    if (!accountNumber) {
      const countResult = await pool.query(
        "SELECT COUNT(*) as count FROM crm_accounts"
      );
      const nextNumber = parseInt(countResult.rows[0].count) + 1;
      accountNumber = `ACC-${nextNumber.toString().padStart(6, "0")}`;
    }

    // Insert account
    const query = `
      INSERT INTO crm_accounts (
        account_number,
        account_name,
        account_type,
        customer_type_id,
        industry,
        annual_revenue,
        employee_count,
        website,
        description,
        parent_account_id,
        is_active,
        rating,
        ownership,
        sic_code,
        ticker_symbol,
        customer_since,
        account_owner_id,
        territory,
        created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19
      )
      RETURNING *
    `;

    const params = [
      accountNumber,
      body.account_name,
      body.account_type,
      body.customer_type_id || null,
      body.industry || null,
      body.annual_revenue || null,
      body.employee_count || null,
      body.website || null,
      body.description || null,
      body.parent_account_id || null,
      body.is_active !== undefined ? body.is_active : true,
      body.rating || null,
      body.ownership || null,
      body.sic_code || null,
      body.ticker_symbol || null,
      body.customer_since || null,
      body.account_owner_id || null,
      body.territory || null,
      body.created_by || null,
    ];

    const result = await pool.query(query, params);

    // Create primary address if provided
    if (body.address) {
      await pool.query(
        `
        INSERT INTO crm_addresses (
          account_id, address_type, street1, street2, city,
          state_province, postal_code, country, is_primary, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `,
        [
          result.rows[0].account_id,
          body.address.address_type || "billing",
          body.address.street1,
          body.address.street2 || null,
          body.address.city,
          body.address.state_province,
          body.address.postal_code,
          body.address.country,
          true,
          true,
        ]
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: "Account created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("CRM Create Account Error:", error);

    if (error.code === "23505") {
      // Unique violation
      return NextResponse.json(
        {
          success: false,
          error: "Account number already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create account",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT /api/crm/accounts - Update account (handled by dynamic route)
// DELETE /api/crm/accounts - Delete account (handled by dynamic route)
