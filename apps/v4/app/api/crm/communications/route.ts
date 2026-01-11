// Phase 7 Task 1: CRM Communications API
// POST /api/crm/communications

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://mac@localhost:5432/ocean-erp",
});

// POST /api/crm/communications - Log a communication/interaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["account_id", "communication_type_id", "subject", "communication_date"];
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

    // Verify contact exists if provided
    if (body.contact_id) {
      const contactCheck = await pool.query(
        "SELECT contact_id FROM crm_contacts WHERE contact_id = $1 AND account_id = $2",
        [body.contact_id, body.account_id]
      );

      if (contactCheck.rows.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Contact not found or does not belong to this account",
          },
          { status: 404 }
        );
      }
    }

    // Verify communication type exists
    const typeCheck = await pool.query(
      "SELECT communication_type_id FROM crm_communication_types WHERE communication_type_id = $1",
      [body.communication_type_id]
    );

    if (typeCheck.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Communication type not found",
        },
        { status: 404 }
      );
    }

    // Insert communication log
    const query = `
      INSERT INTO crm_communication_log (
        account_id,
        contact_id,
        communication_type_id,
        subject,
        description,
        direction,
        status,
        communication_date,
        duration_minutes,
        owner_id,
        opportunity_id,
        case_id,
        campaign_id,
        is_private,
        created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15
      )
      RETURNING *
    `;

    const params = [
      body.account_id,
      body.contact_id || null,
      body.communication_type_id,
      body.subject,
      body.description || null,
      body.direction || 'outbound',
      body.status || 'completed',
      body.communication_date,
      body.duration_minutes || null,
      body.owner_id || null,
      body.opportunity_id || null,
      body.case_id || null,
      body.campaign_id || null,
      body.is_private || false,
      body.created_by || null,
    ];

    const result = await pool.query(query, params);

    // Get the complete communication with related data
    const detailQuery = `
      SELECT 
        cl.*,
        ct.type_name as communication_type_name,
        ct.icon as communication_type_icon,
        a.account_name,
        c.full_name as contact_name,
        c.job_title as contact_title
      FROM crm_communication_log cl
      JOIN crm_communication_types ct ON cl.communication_type_id = ct.communication_type_id
      JOIN crm_accounts a ON cl.account_id = a.account_id
      LEFT JOIN crm_contacts c ON cl.contact_id = c.contact_id
      WHERE cl.communication_id = $1
    `;

    const detailResult = await pool.query(detailQuery, [result.rows[0].communication_id]);

    return NextResponse.json(
      {
        success: true,
        data: detailResult.rows[0],
        message: "Communication logged successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("CRM Log Communication Error:", error);

    if (error.code === "23503") {
      // Foreign key violation
      return NextResponse.json(
        {
          success: false,
          error: "Referenced account, contact, or communication type does not exist",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to log communication",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// GET /api/crm/communications - List communications with filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;
    
    const accountId = searchParams.get("account_id");
    const contactId = searchParams.get("contact_id");
    const communicationTypeId = searchParams.get("communication_type_id");
    const direction = searchParams.get("direction");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    let query = `
      SELECT 
        cl.*,
        ct.type_name as communication_type_name,
        ct.icon as communication_type_icon,
        ct.color as communication_type_color,
        a.account_name,
        a.account_number,
        c.full_name as contact_name,
        c.job_title as contact_title
      FROM crm_communication_log cl
      JOIN crm_communication_types ct ON cl.communication_type_id = ct.communication_type_id
      JOIN crm_accounts a ON cl.account_id = a.account_id
      LEFT JOIN crm_contacts c ON cl.contact_id = c.contact_id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (accountId) {
      query += ` AND cl.account_id = $${paramIndex}`;
      params.push(parseInt(accountId));
      paramIndex++;
    }

    if (contactId) {
      query += ` AND cl.contact_id = $${paramIndex}`;
      params.push(parseInt(contactId));
      paramIndex++;
    }

    if (communicationTypeId) {
      query += ` AND cl.communication_type_id = $${paramIndex}`;
      params.push(parseInt(communicationTypeId));
      paramIndex++;
    }

    if (direction) {
      query += ` AND cl.direction = $${paramIndex}`;
      params.push(direction);
      paramIndex++;
    }

    if (startDate) {
      query += ` AND cl.communication_date >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND cl.communication_date <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as filtered`;
    const countResult = await pool.query(countQuery, params);
    const totalRecords = parseInt(countResult.rows[0].total);

    // Add pagination
    query += ` ORDER BY cl.communication_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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
    console.error("CRM Communications List API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch communications",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
