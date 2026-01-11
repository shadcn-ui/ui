// Phase 7 Task 1: Account Hierarchy API
// GET /api/crm/accounts/[id]/hierarchy

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://mac@localhost:5432/ocean-erp",
});

// Recursive function to build account hierarchy tree
async function buildAccountTree(accountId: number, pool: Pool, maxDepth: number = 5, currentDepth: number = 0): Promise<any> {
  if (currentDepth >= maxDepth) {
    return null;
  }

  // Get account details
  const accountQuery = `
    SELECT 
      a.*,
      ct.type_name as customer_type_name,
      (SELECT COUNT(*) FROM crm_contacts WHERE account_id = a.account_id AND is_active = true) as contact_count,
      (SELECT COUNT(*) FROM crm_accounts WHERE parent_account_id = a.account_id) as child_count
    FROM crm_accounts a
    LEFT JOIN crm_customer_types ct ON a.customer_type_id = ct.customer_type_id
    WHERE a.account_id = $1
  `;

  const accountResult = await pool.query(accountQuery, [accountId]);

  if (accountResult.rows.length === 0) {
    return null;
  }

  const account = accountResult.rows[0];

  // Get child accounts
  const childrenQuery = `
    SELECT account_id
    FROM crm_accounts
    WHERE parent_account_id = $1 AND is_active = true
    ORDER BY account_name
  `;

  const childrenResult = await pool.query(childrenQuery, [accountId]);

  // Recursively build child trees
  const children = await Promise.all(
    childrenResult.rows.map((child) =>
      buildAccountTree(child.account_id, pool, maxDepth, currentDepth + 1)
    )
  );

  // Get relationships
  const relationshipsQuery = `
    SELECT 
      cr.*,
      a.account_name as related_account_name,
      a.account_number as related_account_number
    FROM crm_customer_relationships cr
    JOIN crm_accounts a ON (
      CASE 
        WHEN cr.parent_account_id = $1 THEN cr.child_account_id = a.account_id
        WHEN cr.child_account_id = $1 THEN cr.parent_account_id = a.account_id
      END
    )
    WHERE (cr.parent_account_id = $1 OR cr.child_account_id = $1)
      AND cr.is_active = true
  `;

  const relationshipsResult = await pool.query(relationshipsQuery, [accountId]);

  return {
    ...account,
    depth: currentDepth,
    children: children.filter((c) => c !== null),
    relationships: relationshipsResult.rows,
  };
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const accountId = parseInt(params.id);
    const searchParams = request.nextUrl.searchParams;
    const maxDepth = parseInt(searchParams.get("max_depth") || "5");
    const includeParent = searchParams.get("include_parent") === "true";

    if (isNaN(accountId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid account ID",
        },
        { status: 400 }
      );
    }

    // Build the hierarchy tree starting from this account
    const tree = await buildAccountTree(accountId, pool, maxDepth);

    if (!tree) {
      return NextResponse.json(
        {
          success: false,
          error: "Account not found",
        },
        { status: 404 }
      );
    }

    // Optionally get parent chain
    let parentChain: any[] = [];
    if (includeParent && tree.parent_account_id) {
      const parentQuery = `
        WITH RECURSIVE parent_chain AS (
          SELECT 
            a.account_id,
            a.account_name,
            a.account_number,
            a.parent_account_id,
            1 as level
          FROM crm_accounts a
          WHERE a.account_id = $1
          
          UNION ALL
          
          SELECT 
            a.account_id,
            a.account_name,
            a.account_number,
            a.parent_account_id,
            pc.level + 1
          FROM crm_accounts a
          JOIN parent_chain pc ON a.account_id = pc.parent_account_id
          WHERE pc.level < 10
        )
        SELECT * FROM parent_chain
        WHERE account_id != $1
        ORDER BY level
      `;

      const parentResult = await pool.query(parentQuery, [accountId]);
      parentChain = parentResult.rows;
    }

    // Calculate hierarchy statistics
    const statsQuery = `
      WITH RECURSIVE account_tree AS (
        SELECT 
          account_id,
          parent_account_id,
          1 as depth
        FROM crm_accounts
        WHERE account_id = $1
        
        UNION ALL
        
        SELECT 
          a.account_id,
          a.parent_account_id,
          at.depth + 1
        FROM crm_accounts a
        JOIN account_tree at ON a.parent_account_id = at.account_id
        WHERE at.depth < $2
      )
      SELECT 
        COUNT(*) as total_accounts,
        MAX(depth) as max_depth,
        SUM(CASE WHEN depth = 1 THEN 1 ELSE 0 END) as direct_children,
        (SELECT COUNT(DISTINCT contact_id) 
         FROM crm_contacts c 
         JOIN account_tree at ON c.account_id = at.account_id
         WHERE c.is_active = true) as total_contacts
      FROM account_tree
    `;

    const statsResult = await pool.query(statsQuery, [accountId, maxDepth]);

    return NextResponse.json({
      success: true,
      data: {
        hierarchy: tree,
        parent_chain: parentChain,
        statistics: statsResult.rows[0],
      },
      metadata: {
        execution_time_ms: Date.now(),
        generated_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Account Hierarchy API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch account hierarchy",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
