// Phase 7 Task 2: Opportunity Activities API
// GET/POST /api/crm/opportunities/[id]/activities

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://mac@localhost:5432/ocean-erp",
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const opportunityId = parseInt(params.id);

    if (isNaN(opportunityId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid opportunity ID",
        },
        { status: 400 }
      );
    }

    // Verify opportunity exists
    const oppCheck = await pool.query(
      "SELECT opportunity_id, opportunity_name FROM crm_opportunities WHERE opportunity_id = $1",
      [opportunityId]
    );

    if (oppCheck.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Opportunity not found",
        },
        { status: 404 }
      );
    }

    // Get all activities for this opportunity
    const query = `
      SELECT 
        a.*,
        at.type_name as activity_type_name,
        at.category as activity_category,
        at.icon,
        at.color,
        acc.account_name,
        c.full_name as contact_name
      FROM crm_activities a
      JOIN crm_activity_types at ON a.activity_type_id = at.activity_type_id
      LEFT JOIN crm_accounts acc ON a.account_id = acc.account_id
      LEFT JOIN crm_contacts c ON a.contact_id = c.contact_id
      WHERE a.opportunity_id = $1 AND a.is_active = true
      ORDER BY 
        CASE WHEN a.status = 'planned' THEN 0 ELSE 1 END,
        a.due_date ASC NULLS LAST,
        a.created_at DESC
    `;

    const result = await pool.query(query, [opportunityId]);

    // Get activity statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_activities,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
        COUNT(CASE WHEN status = 'planned' THEN 1 END) as planned_count,
        COUNT(CASE WHEN due_date < CURRENT_TIMESTAMP AND status != 'completed' THEN 1 END) as overdue_count,
        MAX(completed_date) as last_activity_date
      FROM crm_activities
      WHERE opportunity_id = $1 AND is_active = true
    `;

    const statsResult = await pool.query(statsQuery, [opportunityId]);

    return NextResponse.json({
      success: true,
      data: {
        opportunity: oppCheck.rows[0],
        activities: result.rows,
        statistics: statsResult.rows[0],
      },
      metadata: {
        execution_time_ms: Date.now(),
        generated_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Opportunity Activities API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch activities",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const opportunityId = parseInt(params.id);
    const body = await request.json();

    if (isNaN(opportunityId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid opportunity ID",
        },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ["activity_type_id", "subject"];
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

    // Verify opportunity exists and get account_id
    const oppCheck = await pool.query(
      "SELECT opportunity_id, account_id FROM crm_opportunities WHERE opportunity_id = $1",
      [opportunityId]
    );

    if (oppCheck.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Opportunity not found",
        },
        { status: 404 }
      );
    }

    const accountId = oppCheck.rows[0].account_id;

    // Insert activity
    const query = `
      INSERT INTO crm_activities (
        opportunity_id,
        account_id,
        contact_id,
        activity_type_id,
        subject,
        description,
        status,
        priority,
        due_date,
        completed_date,
        duration_minutes,
        owner_id,
        assigned_to,
        outcome,
        next_steps,
        reminder_date,
        created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17
      )
      RETURNING *
    `;

    const insertParams = [
      opportunityId,
      accountId,
      body.contact_id || null,
      body.activity_type_id,
      body.subject,
      body.description || null,
      body.status || 'planned',
      body.priority || 'medium',
      body.due_date || null,
      body.completed_date || null,
      body.duration_minutes || null,
      body.owner_id || null,
      body.assigned_to || null,
      body.outcome || null,
      body.next_steps || null,
      body.reminder_date || null,
      body.created_by || null,
    ];

    const insertResult = await pool.query(query, insertParams);

    // Get complete activity details
    const detailQuery = `
      SELECT 
        a.*,
        at.type_name as activity_type_name,
        at.category as activity_category,
        at.icon,
        at.color,
        acc.account_name,
        c.full_name as contact_name
      FROM crm_activities a
      JOIN crm_activity_types at ON a.activity_type_id = at.activity_type_id
      LEFT JOIN crm_accounts acc ON a.account_id = acc.account_id
      LEFT JOIN crm_contacts c ON a.contact_id = c.contact_id
      WHERE a.activity_id = $1
    `;

    const detailResult = await pool.query(detailQuery, [insertResult.rows[0].activity_id]);

    // Update opportunity last activity date
    await pool.query(
      "UPDATE crm_opportunities SET last_activity_date = CURRENT_DATE WHERE opportunity_id = $1",
      [opportunityId]
    );

    return NextResponse.json(
      {
        success: true,
        data: detailResult.rows[0],
        message: "Activity created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create Opportunity Activity Error:", error);

    if (error.code === "23503") {
      return NextResponse.json(
        {
          success: false,
          error: "Referenced opportunity, activity type, or contact does not exist",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create activity",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
