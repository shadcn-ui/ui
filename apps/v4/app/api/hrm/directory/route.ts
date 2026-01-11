import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/directory - Employee directory with search
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const department_id = searchParams.get("department_id");
    const job_family = searchParams.get("job_family");
    const location = searchParams.get("location"); // city
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    let conditions = ["e.is_active = true", "e.employee_status = 'active'"];
    const params: any[] = [];
    let paramCount = 1;

    if (search) {
      conditions.push(`(
        e.first_name ILIKE $${paramCount} OR
        e.last_name ILIKE $${paramCount} OR
        e.employee_number ILIKE $${paramCount} OR
        e.work_email ILIKE $${paramCount} OR
        d.department_name ILIKE $${paramCount} OR
        jt.job_title_name ILIKE $${paramCount}
      )`);
      params.push(`%${search}%`);
      paramCount++;
    }

    if (department_id) {
      conditions.push(`e.department_id = $${paramCount}`);
      params.push(department_id);
      paramCount++;
    }

    if (job_family) {
      conditions.push(`jt.job_family = $${paramCount}`);
      params.push(job_family);
      paramCount++;
    }

    if (location) {
      conditions.push(`e.city ILIKE $${paramCount}`);
      params.push(`%${location}%`);
      paramCount++;
    }

    const whereClause = conditions.join(" AND ");

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM hrm_employees e
      LEFT JOIN hrm_departments d ON e.department_id = d.department_id
      LEFT JOIN hrm_job_titles jt ON e.job_title_id = jt.job_title_id
      WHERE ${whereClause}
    `;
    const countResult = await client.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get employee directory
    params.push(limit, offset);
    const directoryQuery = `
      SELECT 
        e.employee_id,
        e.employee_number,
        e.first_name,
        e.middle_name,
        e.last_name,
        e.preferred_name,
        e.first_name || ' ' || e.last_name as full_name,
        e.work_email,
        e.work_phone,
        e.mobile_phone,
        e.photo_url,
        e.city,
        e.state_province,
        e.country,
        e.hire_date,
        o.organization_name,
        d.department_name,
        jt.job_title_name,
        jt.job_level,
        jt.job_family,
        p.position_name,
        m.employee_number as manager_employee_number,
        m.first_name || ' ' || m.last_name as manager_name,
        m.work_email as manager_email,
        (
          SELECT json_agg(json_build_object(
            'skill_name', s.skill_name,
            'skill_category', s.skill_category,
            'proficiency_level', s.proficiency_level
          ))
          FROM hrm_employee_skills s
          WHERE s.employee_id = e.employee_id 
            AND s.is_active = true 
            AND s.is_primary_skill = true
          LIMIT 5
        ) as primary_skills,
        (
          SELECT COUNT(*) FROM hrm_employees 
          WHERE reports_to_employee_id = e.employee_id AND is_active = true
        ) as direct_reports_count
      FROM hrm_employees e
      LEFT JOIN hrm_organizations o ON e.organization_id = o.organization_id
      LEFT JOIN hrm_departments d ON e.department_id = d.department_id
      LEFT JOIN hrm_job_titles jt ON e.job_title_id = jt.job_title_id
      LEFT JOIN hrm_positions p ON e.position_id = p.position_id
      LEFT JOIN hrm_employees m ON e.reports_to_employee_id = m.employee_id
      WHERE ${whereClause}
      ORDER BY e.last_name, e.first_name
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    const result = await client.query(directoryQuery, params);

    // Get department distribution
    const deptDistQuery = `
      SELECT 
        d.department_name,
        COUNT(*) as employee_count
      FROM hrm_employees e
      LEFT JOIN hrm_departments d ON e.department_id = d.department_id
      WHERE e.is_active = true AND e.employee_status = 'active'
      GROUP BY d.department_name
      ORDER BY employee_count DESC
      LIMIT 10
    `;
    const deptDistResult = await client.query(deptDistQuery);

    // Get job family distribution
    const jobFamilyQuery = `
      SELECT 
        jt.job_family,
        COUNT(*) as employee_count
      FROM hrm_employees e
      LEFT JOIN hrm_job_titles jt ON e.job_title_id = jt.job_title_id
      WHERE e.is_active = true AND e.employee_status = 'active'
      GROUP BY jt.job_family
      ORDER BY employee_count DESC
    `;
    const jobFamilyResult = await client.query(jobFamilyQuery);

    // Get location distribution
    const locationQuery = `
      SELECT 
        city,
        state_province,
        country,
        COUNT(*) as employee_count
      FROM hrm_employees
      WHERE is_active = true AND employee_status = 'active' AND city IS NOT NULL
      GROUP BY city, state_province, country
      ORDER BY employee_count DESC
      LIMIT 10
    `;
    const locationResult = await client.query(locationQuery);

    return NextResponse.json({
      employees: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      filters: {
        by_department: deptDistResult.rows,
        by_job_family: jobFamilyResult.rows,
        by_location: locationResult.rows,
      },
    });
  } catch (error: any) {
    console.error("Error fetching directory:", error);
    return NextResponse.json(
      { error: "Failed to fetch directory", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
