// Phase 7 Task 1: CRM Contacts API
// GET/POST /api/crm/contacts

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://mac@localhost:5432/ocean-erp",
});

// GET /api/crm/contacts - List all contacts with filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;
    
    // Filters
    const accountId = searchParams.get("account_id");
    const jobTitle = searchParams.get("job_title");
    const department = searchParams.get("department");
    const isPrimaryContact = searchParams.get("is_primary_contact");
    const isDecisionMaker = searchParams.get("is_decision_maker");
    const isActive = searchParams.get("is_active");
    const search = searchParams.get("search");

    let query = `
      SELECT 
        c.*,
        a.account_name,
        a.account_number,
        a.account_type,
        (SELECT COUNT(*) FROM crm_communication_log WHERE contact_id = c.contact_id) as communication_count,
        (SELECT MAX(communication_date) FROM crm_communication_log WHERE contact_id = c.contact_id) as last_contact_date,
        (SELECT COUNT(*) FROM crm_phone_numbers WHERE contact_id = c.contact_id AND is_active = true) as phone_count,
        (SELECT COUNT(*) FROM crm_email_addresses WHERE contact_id = c.contact_id AND is_active = true) as email_count
      FROM crm_contacts c
      JOIN crm_accounts a ON c.account_id = a.account_id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (accountId) {
      query += ` AND c.account_id = $${paramIndex}`;
      params.push(parseInt(accountId));
      paramIndex++;
    }

    if (jobTitle) {
      query += ` AND c.job_title ILIKE $${paramIndex}`;
      params.push(`%${jobTitle}%`);
      paramIndex++;
    }

    if (department) {
      query += ` AND c.department ILIKE $${paramIndex}`;
      params.push(`%${department}%`);
      paramIndex++;
    }

    if (isPrimaryContact !== null && isPrimaryContact !== undefined) {
      query += ` AND c.is_primary_contact = $${paramIndex}`;
      params.push(isPrimaryContact === "true");
      paramIndex++;
    }

    if (isDecisionMaker !== null && isDecisionMaker !== undefined) {
      query += ` AND c.is_decision_maker = $${paramIndex}`;
      params.push(isDecisionMaker === "true");
      paramIndex++;
    }

    if (isActive !== null && isActive !== undefined) {
      query += ` AND c.is_active = $${paramIndex}`;
      params.push(isActive === "true");
      paramIndex++;
    }

    if (search) {
      query += ` AND (
        c.first_name ILIKE $${paramIndex} OR
        c.last_name ILIKE $${paramIndex} OR
        c.full_name ILIKE $${paramIndex} OR
        c.primary_email ILIKE $${paramIndex} OR
        c.job_title ILIKE $${paramIndex}
      )`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as filtered`;
    const countResult = await pool.query(countQuery, params);
    const totalRecords = parseInt(countResult.rows[0].total);

    // Add pagination
    query += ` ORDER BY c.last_name, c.first_name LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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
    console.error("CRM Contacts API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch contacts",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/crm/contacts - Create new contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["account_id", "first_name", "last_name"];
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

    // Verify account exists
    const accountCheck = await pool.query(
      "SELECT account_id FROM crm_accounts WHERE account_id = $1",
      [body.account_id]
    );

    if (accountCheck.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Account not found",
        },
        { status: 404 }
      );
    }

    // If this is marked as primary contact, unset any existing primary for this account
    if (body.is_primary_contact === true) {
      await pool.query(
        "UPDATE crm_contacts SET is_primary_contact = false WHERE account_id = $1",
        [body.account_id]
      );
    }

    // Insert contact
    const query = `
      INSERT INTO crm_contacts (
        account_id,
        salutation,
        first_name,
        middle_name,
        last_name,
        suffix,
        primary_email,
        primary_phone,
        mobile_phone,
        job_title,
        department,
        reports_to_contact_id,
        linkedin_url,
        twitter_handle,
        preferred_contact_method,
        do_not_call,
        do_not_email,
        email_opt_out,
        date_of_birth,
        hire_date,
        is_primary_contact,
        is_decision_maker,
        is_active,
        created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24
      )
      RETURNING *
    `;

    const params = [
      body.account_id,
      body.salutation || null,
      body.first_name,
      body.middle_name || null,
      body.last_name,
      body.suffix || null,
      body.primary_email || null,
      body.primary_phone || null,
      body.mobile_phone || null,
      body.job_title || null,
      body.department || null,
      body.reports_to_contact_id || null,
      body.linkedin_url || null,
      body.twitter_handle || null,
      body.preferred_contact_method || null,
      body.do_not_call || false,
      body.do_not_email || false,
      body.email_opt_out || false,
      body.date_of_birth || null,
      body.hire_date || null,
      body.is_primary_contact || false,
      body.is_decision_maker || false,
      body.is_active !== undefined ? body.is_active : true,
      body.created_by || null,
    ];

    const result = await pool.query(query, params);

    // Add additional phone numbers if provided
    if (body.additional_phones && Array.isArray(body.additional_phones)) {
      for (const phone of body.additional_phones) {
        await pool.query(
          `
          INSERT INTO crm_phone_numbers (
            contact_id, phone_type, phone_number, extension, country_code, is_primary
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `,
          [
            result.rows[0].contact_id,
            phone.phone_type || "work",
            phone.phone_number,
            phone.extension || null,
            phone.country_code || null,
            phone.is_primary || false,
          ]
        );
      }
    }

    // Add additional email addresses if provided
    if (body.additional_emails && Array.isArray(body.additional_emails)) {
      for (const email of body.additional_emails) {
        await pool.query(
          `
          INSERT INTO crm_email_addresses (
            contact_id, email_type, email_address, is_primary
          ) VALUES ($1, $2, $3, $4)
        `,
          [
            result.rows[0].contact_id,
            email.email_type || "work",
            email.email_address,
            email.is_primary || false,
          ]
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: "Contact created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("CRM Create Contact Error:", error);

    if (error.code === "23503") {
      // Foreign key violation
      return NextResponse.json(
        {
          success: false,
          error: "Referenced account or contact does not exist",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create contact",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
