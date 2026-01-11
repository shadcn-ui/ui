import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/departments - List departments with hierarchy
// POST /api/hrm/departments - Create new department
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const organization_id = searchParams.get("organization_id");
    const parent_id = searchParams.get("parent_id");
    const function_type = searchParams.get("function_type");
    const include_hierarchy = searchParams.get("include_hierarchy") === "true";

    let conditions = ["d.is_active = true"];
    const params: any[] = [];
    let paramCount = 1;

    if (organization_id) {
      conditions.push(`d.organization_id = $${paramCount}`);
      params.push(organization_id);
      paramCount++;
    }

    if (parent_id) {
      conditions.push(`d.parent_department_id = $${paramCount}`);
      params.push(parent_id);
      paramCount++;
    }

    if (function_type) {
      conditions.push(`d.function_type = $${paramCount}`);
      params.push(function_type);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT 
        d.*,
        o.organization_name,
        p.department_name as parent_department_name,
        h.employee_number as head_employee_number,
        h.first_name || ' ' || h.last_name as department_head_name,
        (
          SELECT COUNT(*) FROM hrm_departments 
          WHERE parent_department_id = d.department_id AND is_active = true
        ) as child_departments_count,
        (
          SELECT COUNT(*) FROM hrm_positions 
          WHERE department_id = d.department_id AND is_active = true
        ) as positions_count
      FROM hrm_departments d
      LEFT JOIN hrm_organizations o ON d.organization_id = o.organization_id
      LEFT JOIN hrm_departments p ON d.parent_department_id = p.department_id
      LEFT JOIN hrm_employees h ON d.department_head_id = h.employee_id
      ${whereClause}
      ORDER BY o.organization_name, d.department_name
    `;

    const result = await client.query(query, params);

    if (include_hierarchy) {
      // Build hierarchy tree
      const departments = result.rows;
      const deptMap = new Map();
      const roots: any[] = [];

      // First pass: create map
      departments.forEach((dept) => {
        deptMap.set(dept.department_id, { ...dept, children: [] });
      });

      // Second pass: build tree
      departments.forEach((dept) => {
        const node = deptMap.get(dept.department_id);
        if (dept.parent_department_id) {
          const parent = deptMap.get(dept.parent_department_id);
          if (parent) {
            parent.children.push(node);
          }
        } else {
          roots.push(node);
        }
      });

      return NextResponse.json({
        departments: result.rows,
        hierarchy: roots,
      });
    }

    return NextResponse.json({
      departments: result.rows,
    });
  } catch (error: any) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Failed to fetch departments", details: error.message },
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
      department_name,
      organization_id,
      function_type,
    } = body;

    if (!department_name || !organization_id || !function_type) {
      return NextResponse.json(
        {
          error: "Missing required fields: department_name, organization_id, function_type",
        },
        { status: 400 }
      );
    }

    // Generate department code
    const maxCodeResult = await client.query(`
      SELECT department_code 
      FROM hrm_departments 
      WHERE organization_id = $1
      ORDER BY department_id DESC 
      LIMIT 1
    `, [organization_id]);

    let nextNumber = 1;
    if (maxCodeResult.rows.length > 0) {
      const lastCode = maxCodeResult.rows[0].department_code;
      const numMatch = lastCode.match(/\d+$/);
      if (numMatch) {
        nextNumber = parseInt(numMatch[0]) + 1;
      }
    }

    const department_code = `DEPT-${String(nextNumber).padStart(4, "0")}`;

    const insertQuery = `
      INSERT INTO hrm_departments (
        department_code, department_name, organization_id,
        parent_department_id, department_head_id,
        cost_center_code, budget_code, description, function_type,
        created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      )
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      department_code,
      department_name,
      organization_id,
      body.parent_department_id || null,
      body.department_head_id || null,
      body.cost_center_code || null,
      body.budget_code || null,
      body.description || null,
      function_type,
      body.created_by || null,
    ]);

    // Fetch complete department data
    const completeQuery = `
      SELECT 
        d.*,
        o.organization_name,
        p.department_name as parent_department_name,
        h.first_name || ' ' || h.last_name as department_head_name
      FROM hrm_departments d
      LEFT JOIN hrm_organizations o ON d.organization_id = o.organization_id
      LEFT JOIN hrm_departments p ON d.parent_department_id = p.department_id
      LEFT JOIN hrm_employees h ON d.department_head_id = h.employee_id
      WHERE d.department_id = $1
    `;
    const completeResult = await client.query(completeQuery, [result.rows[0].department_id]);

    return NextResponse.json(completeResult.rows[0], { status: 201 });
  } catch (error: any) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      { error: "Failed to create department", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
