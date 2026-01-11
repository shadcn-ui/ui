import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/organizations - List organizations with hierarchy
// POST /api/hrm/organizations - Create new organization
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const organization_type = searchParams.get("organization_type");
    const parent_id = searchParams.get("parent_id");
    const include_hierarchy = searchParams.get("include_hierarchy") === "true";

    let conditions = ["is_active = true"];
    const params: any[] = [];
    let paramCount = 1;

    if (organization_type) {
      conditions.push(`organization_type = $${paramCount}`);
      params.push(organization_type);
      paramCount++;
    }

    if (parent_id) {
      conditions.push(`parent_organization_id = $${paramCount}`);
      params.push(parent_id);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT 
        o.*,
        p.organization_name as parent_organization_name,
        (
          SELECT COUNT(*) FROM hrm_organizations 
          WHERE parent_organization_id = o.organization_id AND is_active = true
        ) as child_organizations_count,
        (
          SELECT COUNT(*) FROM hrm_departments 
          WHERE organization_id = o.organization_id AND is_active = true
        ) as departments_count
      FROM hrm_organizations o
      LEFT JOIN hrm_organizations p ON o.parent_organization_id = p.organization_id
      ${whereClause}
      ORDER BY o.organization_type, o.organization_name
    `;

    const result = await client.query(query, params);

    if (include_hierarchy) {
      // Build hierarchy tree
      const organizations = result.rows;
      const orgMap = new Map();
      const roots: any[] = [];

      // First pass: create map
      organizations.forEach((org) => {
        orgMap.set(org.organization_id, { ...org, children: [] });
      });

      // Second pass: build tree
      organizations.forEach((org) => {
        const node = orgMap.get(org.organization_id);
        if (org.parent_organization_id) {
          const parent = orgMap.get(org.parent_organization_id);
          if (parent) {
            parent.children.push(node);
          }
        } else {
          roots.push(node);
        }
      });

      return NextResponse.json({
        organizations: result.rows,
        hierarchy: roots,
      });
    }

    return NextResponse.json({
      organizations: result.rows,
    });
  } catch (error: any) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { error: "Failed to fetch organizations", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();

    const {
      organization_name,
      legal_name,
      organization_type,
    } = body;

    if (!organization_name || !organization_type) {
      return NextResponse.json(
        {
          error: "Missing required fields: organization_name, organization_type",
        },
        { status: 400 }
      );
    }

    // Generate organization code
    const maxCodeResult = await client.query(`
      SELECT organization_code 
      FROM hrm_organizations 
      ORDER BY organization_id DESC 
      LIMIT 1
    `);

    let nextNumber = 1;
    if (maxCodeResult.rows.length > 0) {
      const lastCode = maxCodeResult.rows[0].organization_code;
      const numMatch = lastCode.match(/\d+$/);
      if (numMatch) {
        nextNumber = parseInt(numMatch[0]) + 1;
      }
    }

    const typePrefix = organization_type.toUpperCase().substring(0, 3);
    const organization_code = `ORG-${typePrefix}-${String(nextNumber).padStart(3, "0")}`;

    const insertQuery = `
      INSERT INTO hrm_organizations (
        organization_code, organization_name, legal_name,
        parent_organization_id, organization_type, tax_id, registration_number,
        address_line1, address_line2, city, state_province, postal_code, country,
        phone, email, website, established_date,
        created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
      )
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      organization_code,
      organization_name,
      legal_name || organization_name,
      body.parent_organization_id || null,
      organization_type,
      body.tax_id || null,
      body.registration_number || null,
      body.address_line1 || null,
      body.address_line2 || null,
      body.city || null,
      body.state_province || null,
      body.postal_code || null,
      body.country || null,
      body.phone || null,
      body.email || null,
      body.website || null,
      body.established_date || null,
      body.created_by || null,
    ]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { error: "Failed to create organization", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
