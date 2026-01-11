// Phase 7 Task 1: CRM Search API
// GET /api/crm/customers/search

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://mac@localhost:5432/ocean-erp",
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || searchParams.get("query");
    const searchType = searchParams.get("type") || "all"; // 'all', 'accounts', 'contacts'
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Search query must be at least 2 characters",
        },
        { status: 400 }
      );
    }

    const searchTerm = `%${query}%`;
    const results: any = {
      accounts: [],
      contacts: [],
      total_results: 0,
    };

    // Search accounts
    if (searchType === "all" || searchType === "accounts") {
      const accountQuery = `
        SELECT 
          'account' as result_type,
          a.account_id as id,
          a.account_number,
          a.account_name as name,
          a.account_type,
          a.industry,
          a.website,
          a.rating,
          ct.type_name as customer_type,
          (SELECT COUNT(*) FROM crm_contacts WHERE account_id = a.account_id AND is_active = true) as contact_count,
          (SELECT full_name FROM crm_contacts WHERE account_id = a.account_id AND is_primary_contact = true LIMIT 1) as primary_contact_name
        FROM crm_accounts a
        LEFT JOIN crm_customer_types ct ON a.customer_type_id = ct.customer_type_id
        WHERE a.is_active = true
          AND (
            a.account_name ILIKE $1 OR
            a.account_number ILIKE $1 OR
            a.website ILIKE $1 OR
            a.industry ILIKE $1 OR
            a.description ILIKE $1
          )
        ORDER BY 
          CASE WHEN a.account_name ILIKE $1 THEN 1 ELSE 2 END,
          a.account_name
        LIMIT $2
      `;

      const accountResult = await pool.query(accountQuery, [searchTerm, limit]);
      results.accounts = accountResult.rows;
    }

    // Search contacts
    if (searchType === "all" || searchType === "contacts") {
      const contactQuery = `
        SELECT 
          'contact' as result_type,
          c.contact_id as id,
          c.full_name as name,
          c.job_title,
          c.department,
          c.primary_email,
          c.primary_phone,
          c.is_primary_contact,
          c.is_decision_maker,
          a.account_id,
          a.account_name,
          a.account_number
        FROM crm_contacts c
        JOIN crm_accounts a ON c.account_id = a.account_id
        WHERE c.is_active = true
          AND (
            c.first_name ILIKE $1 OR
            c.last_name ILIKE $1 OR
            c.full_name ILIKE $1 OR
            c.primary_email ILIKE $1 OR
            c.job_title ILIKE $1 OR
            c.department ILIKE $1
          )
        ORDER BY 
          CASE WHEN c.full_name ILIKE $1 THEN 1 ELSE 2 END,
          c.is_primary_contact DESC,
          c.full_name
        LIMIT $2
      `;

      const contactResult = await pool.query(contactQuery, [searchTerm, limit]);
      results.contacts = contactResult.rows;
    }

    results.total_results = results.accounts.length + results.contacts.length;

    // Get search suggestions (common tags and categories)
    const suggestionsQuery = `
      SELECT DISTINCT tag_name, COUNT(*) as usage_count
      FROM crm_tags
      WHERE tag_name ILIKE $1
      GROUP BY tag_name
      ORDER BY usage_count DESC
      LIMIT 5
    `;

    const suggestionsResult = await pool.query(suggestionsQuery, [searchTerm]);

    return NextResponse.json({
      success: true,
      query: query,
      data: results,
      suggestions: suggestionsResult.rows.map((r) => r.tag_name),
      metadata: {
        search_type: searchType,
        execution_time_ms: Date.now(),
        generated_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("CRM Search API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Search failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
