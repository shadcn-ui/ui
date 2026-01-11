// Phase 7 Task 1: Account History API
// GET /api/crm/accounts/[id]/history

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
    const accountId = parseInt(params.id);
    const searchParams = request.nextUrl.searchParams;
    
    // Filters
    const communicationType = searchParams.get("communication_type");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const limit = parseInt(searchParams.get("limit") || "100");

    if (isNaN(accountId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid account ID",
        },
        { status: 400 }
      );
    }

    // Verify account exists
    const accountCheck = await pool.query(
      "SELECT account_id, account_name FROM crm_accounts WHERE account_id = $1",
      [accountId]
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

    // Build query for communication history
    let query = `
      SELECT 
        cl.*,
        ct.type_name as communication_type_name,
        ct.icon as communication_type_icon,
        ct.color as communication_type_color,
        c.full_name as contact_name,
        c.job_title as contact_title,
        c.primary_email as contact_email
      FROM crm_communication_log cl
      JOIN crm_communication_types ct ON cl.communication_type_id = ct.communication_type_id
      LEFT JOIN crm_contacts c ON cl.contact_id = c.contact_id
      WHERE cl.account_id = $1
    `;

    const queryParams: any[] = [accountId];
    let paramIndex = 2;

    if (communicationType) {
      query += ` AND ct.type_code = $${paramIndex}`;
      queryParams.push(communicationType);
      paramIndex++;
    }

    if (startDate) {
      query += ` AND cl.communication_date >= $${paramIndex}`;
      queryParams.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND cl.communication_date <= $${paramIndex}`;
      queryParams.push(endDate);
      paramIndex++;
    }

    query += ` ORDER BY cl.communication_date DESC LIMIT $${paramIndex}`;
    queryParams.push(limit);

    const historyResult = await pool.query(query, queryParams);

    // Get summary statistics
    const statsQuery = `
      SELECT 
        ct.type_name,
        ct.type_code,
        COUNT(*) as count,
        COUNT(CASE WHEN cl.direction = 'inbound' THEN 1 END) as inbound_count,
        COUNT(CASE WHEN cl.direction = 'outbound' THEN 1 END) as outbound_count,
        AVG(cl.duration_minutes) as avg_duration_minutes
      FROM crm_communication_log cl
      JOIN crm_communication_types ct ON cl.communication_type_id = ct.communication_type_id
      WHERE cl.account_id = $1
      GROUP BY ct.type_name, ct.type_code
      ORDER BY count DESC
    `;

    const statsResult = await pool.query(statsQuery, [accountId]);

    // Get recent notes
    const notesQuery = `
      SELECT 
        note_id,
        note_title,
        note_content,
        is_private,
        is_pinned,
        created_at,
        created_by
      FROM crm_notes
      WHERE entity_type = 'account' AND entity_id = $1
      ORDER BY is_pinned DESC, created_at DESC
      LIMIT 10
    `;

    const notesResult = await pool.query(notesQuery, [accountId]);

    // Get account tags
    const tagsQuery = `
      SELECT 
        tag_name,
        tag_category
      FROM crm_tags
      WHERE entity_type = 'account' AND entity_id = $1
      ORDER BY tag_category, tag_name
    `;

    const tagsResult = await pool.query(tagsQuery, [accountId]);

    return NextResponse.json({
      success: true,
      data: {
        account: accountCheck.rows[0],
        history: historyResult.rows,
        statistics: {
          total_interactions: historyResult.rows.length,
          by_type: statsResult.rows,
          first_contact_date: historyResult.rows.length > 0 
            ? historyResult.rows[historyResult.rows.length - 1].communication_date 
            : null,
          last_contact_date: historyResult.rows.length > 0 
            ? historyResult.rows[0].communication_date 
            : null,
        },
        notes: notesResult.rows,
        tags: tagsResult.rows,
      },
      metadata: {
        execution_time_ms: Date.now(),
        generated_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Account History API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch account history",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
