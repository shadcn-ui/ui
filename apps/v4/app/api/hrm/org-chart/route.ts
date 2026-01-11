import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/org-chart - Get organizational hierarchy chart
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const root_employee_id = searchParams.get("root_employee_id");
    const department_id = searchParams.get("department_id");
    const max_depth = parseInt(searchParams.get("max_depth") || "10");

    // If department_id is provided, get the department head as root
    let rootId = root_employee_id;
    if (department_id && !root_employee_id) {
      const deptResult = await client.query(
        "SELECT department_head_id FROM hrm_departments WHERE department_id = $1",
        [department_id]
      );
      if (deptResult.rows.length > 0) {
        rootId = deptResult.rows[0].department_head_id;
      }
    }

    // Recursive CTE to build the hierarchy
    const query = `
      WITH RECURSIVE org_hierarchy AS (
        -- Base case: root employee(s)
        SELECT 
          e.employee_id,
          e.employee_number,
          e.first_name,
          e.last_name,
          e.first_name || ' ' || e.last_name as full_name,
          e.work_email,
          e.photo_url,
          e.employee_status,
          e.reports_to_employee_id,
          d.department_name,
          jt.job_title_name,
          jt.job_level,
          p.position_name,
          0 as depth,
          ARRAY[e.employee_id] as path,
          e.employee_number::TEXT as sort_path
        FROM hrm_employees e
        LEFT JOIN hrm_departments d ON e.department_id = d.department_id
        LEFT JOIN hrm_job_titles jt ON e.job_title_id = jt.job_title_id
        LEFT JOIN hrm_positions p ON e.position_id = p.position_id
        WHERE 
          e.is_active = true 
          AND e.employee_status = 'active'
          AND ${rootId ? "e.employee_id = $1" : "e.reports_to_employee_id IS NULL"}
          ${department_id && !rootId ? "AND e.department_id = $2" : ""}
        
        UNION ALL
        
        -- Recursive case: employees reporting to current level
        SELECT 
          e.employee_id,
          e.employee_number,
          e.first_name,
          e.last_name,
          e.first_name || ' ' || e.last_name as full_name,
          e.work_email,
          e.photo_url,
          e.employee_status,
          e.reports_to_employee_id,
          d.department_name,
          jt.job_title_name,
          jt.job_level,
          p.position_name,
          oh.depth + 1,
          oh.path || e.employee_id,
          oh.sort_path || '-' || e.employee_number::TEXT
        FROM hrm_employees e
        INNER JOIN org_hierarchy oh ON e.reports_to_employee_id = oh.employee_id
        LEFT JOIN hrm_departments d ON e.department_id = d.department_id
        LEFT JOIN hrm_job_titles jt ON e.job_title_id = jt.job_title_id
        LEFT JOIN hrm_positions p ON e.position_id = p.position_id
        WHERE 
          e.is_active = true 
          AND e.employee_status = 'active'
          AND oh.depth < $${department_id && !rootId ? "3" : rootId ? "2" : "1"}
          AND NOT (e.employee_id = ANY(oh.path))  -- Prevent cycles
      )
      SELECT 
        oh.*,
        (
          SELECT COUNT(*) 
          FROM hrm_employees 
          WHERE reports_to_employee_id = oh.employee_id 
            AND is_active = true 
            AND employee_status = 'active'
        ) as direct_reports_count
      FROM org_hierarchy oh
      ORDER BY oh.sort_path
    `;

    const params = [];
    if (rootId) params.push(rootId);
    if (department_id && !rootId) params.push(department_id);
    params.push(max_depth);

    const result = await client.query(query, params);

    // Build hierarchical tree structure
    const employees = result.rows;
    const employeeMap = new Map();
    const roots: any[] = [];

    // Create map of all employees
    employees.forEach((emp) => {
      employeeMap.set(emp.employee_id, {
        ...emp,
        children: [],
      });
    });

    // Build tree
    employees.forEach((emp) => {
      const node = employeeMap.get(emp.employee_id);
      if (emp.reports_to_employee_id && employeeMap.has(emp.reports_to_employee_id)) {
        const parent = employeeMap.get(emp.reports_to_employee_id);
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    });

    // Get organization statistics
    const statsQuery = `
      SELECT 
        COUNT(DISTINCT employee_id) as total_employees,
        COUNT(DISTINCT department_id) as total_departments,
        MAX(depth) as max_depth,
        AVG(direct_reports_count) as avg_span_of_control
      FROM (
        SELECT 
          e.employee_id,
          e.department_id,
          0 as depth,
          (
            SELECT COUNT(*) 
            FROM hrm_employees 
            WHERE reports_to_employee_id = e.employee_id AND is_active = true
          ) as direct_reports_count
        FROM hrm_employees e
        WHERE e.is_active = true AND e.employee_status = 'active'
      ) sub
    `;
    const statsResult = await client.query(statsQuery);

    return NextResponse.json({
      org_chart: roots,
      employees: employees,
      statistics: statsResult.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching org chart:", error);
    return NextResponse.json(
      { error: "Failed to fetch org chart", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
