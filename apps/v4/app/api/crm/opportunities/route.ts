// Phase 7 Task 2: Opportunities API
// GET/POST /api/crm/opportunities

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://mac@localhost:5432/ocean-erp",
});

// GET /api/crm/opportunities - List opportunities with filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;
    
    // Filters
    const accountId = searchParams.get("account_id");
    const stageId = searchParams.get("stage_id");
    const ownerId = searchParams.get("owner_id");
    const opportunityType = searchParams.get("opportunity_type");
    const priority = searchParams.get("priority");
    const isClosed = searchParams.get("is_closed");
    const isWon = searchParams.get("is_won");
    const search = searchParams.get("search");

    let query = `
      SELECT 
        o.*,
        a.account_name,
        a.account_number,
        a.account_type,
        c.full_name as contact_name,
        c.job_title as contact_title,
        ps.stage_name,
        ps.stage_code,
        ps.stage_category,
        ps.color as stage_color,
        ps.icon as stage_icon,
        wlr.reason_name as win_loss_reason,
        (SELECT COUNT(*) FROM crm_activities WHERE opportunity_id = o.opportunity_id) as activity_count,
        (SELECT COUNT(*) FROM crm_quotes WHERE opportunity_id = o.opportunity_id) as quote_count,
        (SELECT COUNT(*) FROM crm_opportunity_competitors WHERE opportunity_id = o.opportunity_id) as competitor_count
      FROM crm_opportunities o
      JOIN crm_accounts a ON o.account_id = a.account_id
      LEFT JOIN crm_contacts c ON o.contact_id = c.contact_id
      JOIN crm_pipeline_stages ps ON o.stage_id = ps.stage_id
      LEFT JOIN crm_win_loss_reasons wlr ON o.win_loss_reason_id = wlr.win_loss_reason_id
      WHERE o.is_active = true
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (accountId) {
      query += ` AND o.account_id = $${paramIndex}`;
      params.push(parseInt(accountId));
      paramIndex++;
    }

    if (stageId) {
      query += ` AND o.stage_id = $${paramIndex}`;
      params.push(parseInt(stageId));
      paramIndex++;
    }

    if (ownerId) {
      query += ` AND o.owner_id = $${paramIndex}`;
      params.push(parseInt(ownerId));
      paramIndex++;
    }

    if (opportunityType) {
      query += ` AND o.opportunity_type = $${paramIndex}`;
      params.push(opportunityType);
      paramIndex++;
    }

    if (priority) {
      query += ` AND o.priority = $${paramIndex}`;
      params.push(priority);
      paramIndex++;
    }

    if (isClosed !== null && isClosed !== undefined) {
      query += ` AND o.is_closed = $${paramIndex}`;
      params.push(isClosed === "true");
      paramIndex++;
    }

    if (isWon !== null && isWon !== undefined) {
      query += ` AND o.is_won = $${paramIndex}`;
      params.push(isWon === "true");
      paramIndex++;
    }

    if (search) {
      query += ` AND (
        o.opportunity_name ILIKE $${paramIndex} OR
        o.opportunity_number ILIKE $${paramIndex} OR
        a.account_name ILIKE $${paramIndex} OR
        o.description ILIKE $${paramIndex}
      )`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as filtered`;
    const countResult = await pool.query(countQuery, params);
    const totalRecords = parseInt(countResult.rows[0].total);

    // Add sorting and pagination
    query += ` ORDER BY 
      CASE WHEN o.is_closed = false THEN 0 ELSE 1 END,
      o.expected_close_date ASC,
      o.amount DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Calculate summary statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_opportunities,
        COUNT(CASE WHEN is_closed = false THEN 1 END) as open_opportunities,
        COUNT(CASE WHEN is_won = true THEN 1 END) as won_opportunities,
        COUNT(CASE WHEN is_won = false AND is_closed = true THEN 1 END) as lost_opportunities,
        SUM(amount) as total_pipeline_value,
        SUM(CASE WHEN is_closed = false THEN amount END) as open_pipeline_value,
        SUM(expected_revenue) as weighted_pipeline_value,
        AVG(amount) as avg_deal_size
      FROM crm_opportunities
      WHERE is_active = true
    `;

    const statsResult = await pool.query(statsQuery);

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total_records: totalRecords,
        total_pages: Math.ceil(totalRecords / limit),
      },
      summary: statsResult.rows[0],
      metadata: {
        execution_time_ms: Date.now(),
        generated_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("CRM Opportunities API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch opportunities",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/crm/opportunities - Create new opportunity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["opportunity_name", "account_id", "stage_id"];
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

    // Verify stage exists
    const stageCheck = await pool.query(
      "SELECT stage_id, probability FROM crm_pipeline_stages WHERE stage_id = $1",
      [body.stage_id]
    );

    if (stageCheck.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Pipeline stage not found",
        },
        { status: 404 }
      );
    }

    // Generate opportunity number
    const numberResult = await pool.query(
      "SELECT COALESCE(MAX(CAST(SUBSTRING(opportunity_number FROM 5) AS INTEGER)), 0) + 1 as next_num FROM crm_opportunities WHERE opportunity_number LIKE 'OPP-%'"
    );
    const opportunityNumber = `OPP-${String(numberResult.rows[0].next_num).padStart(6, '0')}`;

    // If probability not provided, use stage default
    const probability = body.probability !== undefined 
      ? body.probability 
      : stageCheck.rows[0].probability;

    // Insert opportunity
    const query = `
      INSERT INTO crm_opportunities (
        opportunity_number,
        opportunity_name,
        account_id,
        contact_id,
        stage_id,
        amount,
        probability,
        close_date,
        expected_close_date,
        opportunity_type,
        lead_source,
        priority,
        owner_id,
        sales_team_id,
        has_competition,
        description,
        next_steps,
        pain_points,
        created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19
      )
      RETURNING *
    `;

    const params = [
      opportunityNumber,
      body.opportunity_name,
      body.account_id,
      body.contact_id || null,
      body.stage_id,
      body.amount || null,
      probability,
      body.close_date || null,
      body.expected_close_date || null,
      body.opportunity_type || 'new_business',
      body.lead_source || null,
      body.priority || 'medium',
      body.owner_id || null,
      body.sales_team_id || null,
      body.has_competition || false,
      body.description || null,
      body.next_steps || null,
      body.pain_points || null,
      body.created_by || null,
    ];

    const result = await pool.query(query, params);

    // Get the complete opportunity with related data
    const detailQuery = `
      SELECT 
        o.*,
        a.account_name,
        a.account_number,
        c.full_name as contact_name,
        ps.stage_name,
        ps.stage_code
      FROM crm_opportunities o
      JOIN crm_accounts a ON o.account_id = a.account_id
      LEFT JOIN crm_contacts c ON o.contact_id = c.contact_id
      JOIN crm_pipeline_stages ps ON o.stage_id = ps.stage_id
      WHERE o.opportunity_id = $1
    `;

    const detailResult = await pool.query(detailQuery, [result.rows[0].opportunity_id]);

    return NextResponse.json(
      {
        success: true,
        data: detailResult.rows[0],
        message: "Opportunity created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("CRM Create Opportunity Error:", error);

    if (error.code === "23503") {
      return NextResponse.json(
        {
          success: false,
          error: "Referenced account, contact, or stage does not exist",
        },
        { status: 400 }
      );
    }

    if (error.code === "23505") {
      return NextResponse.json(
        {
          success: false,
          error: "Opportunity number already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create opportunity",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
