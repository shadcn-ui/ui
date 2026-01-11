// Phase 7 Task 1: Account Contacts API
// GET /api/crm/accounts/[id]/contacts

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

    // Get all contacts for this account with additional details
    const query = `
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM crm_communication_log WHERE contact_id = c.contact_id) as communication_count,
        (SELECT MAX(communication_date) FROM crm_communication_log WHERE contact_id = c.contact_id) as last_contact_date,
        
        -- Get all phone numbers
        COALESCE(
          (SELECT json_agg(
            json_build_object(
              'phone_id', phone_id,
              'phone_type', phone_type,
              'phone_number', phone_number,
              'extension', extension,
              'is_primary', is_primary
            ) ORDER BY is_primary DESC, phone_type
          ) FROM crm_phone_numbers WHERE contact_id = c.contact_id AND is_active = true),
          '[]'::json
        ) as phone_numbers,
        
        -- Get all email addresses
        COALESCE(
          (SELECT json_agg(
            json_build_object(
              'email_id', email_id,
              'email_type', email_type,
              'email_address', email_address,
              'is_primary', is_primary
            ) ORDER BY is_primary DESC, email_type
          ) FROM crm_email_addresses WHERE contact_id = c.contact_id AND is_active = true),
          '[]'::json
        ) as email_addresses,
        
        -- Get social profiles
        COALESCE(
          (SELECT json_agg(
            json_build_object(
              'platform', platform,
              'profile_url', profile_url,
              'username', username
            )
          ) FROM crm_social_profiles WHERE contact_id = c.contact_id),
          '[]'::json
        ) as social_profiles,
        
        -- Get contact roles
        COALESCE(
          (SELECT json_agg(
            json_build_object(
              'role_type', role_type,
              'role_description', role_description,
              'is_active', is_active
            )
          ) FROM crm_contact_roles WHERE contact_id = c.contact_id AND is_active = true),
          '[]'::json
        ) as roles
        
      FROM crm_contacts c
      WHERE c.account_id = $1
      ORDER BY c.is_primary_contact DESC, c.last_name, c.first_name
    `;

    const result = await pool.query(query, [accountId]);

    return NextResponse.json({
      success: true,
      data: {
        account: accountCheck.rows[0],
        contacts: result.rows,
        total_contacts: result.rows.length,
        primary_contact: result.rows.find((c) => c.is_primary_contact) || null,
        decision_makers: result.rows.filter((c) => c.is_decision_maker),
      },
      metadata: {
        execution_time_ms: Date.now(),
        generated_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Account Contacts API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch account contacts",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
