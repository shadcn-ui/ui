import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/employees - List employees with filtering and pagination
// POST /api/hrm/employees - Create new employee
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const organization_id = searchParams.get("organization_id");
    const department_id = searchParams.get("department_id");
    const position_id = searchParams.get("position_id");
    const job_title_id = searchParams.get("job_title_id");
    const manager_id = searchParams.get("manager_id");
    const employment_type = searchParams.get("employment_type");
    const employee_status = searchParams.get("employee_status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Build WHERE clause
    const conditions = ["e.is_active = true"];
    const params: any[] = [];
    let paramCount = 1;

    if (organization_id) {
      conditions.push(`e.organization_id = $${paramCount}`);
      params.push(organization_id);
      paramCount++;
    }

    if (department_id) {
      conditions.push(`e.department_id = $${paramCount}`);
      params.push(department_id);
      paramCount++;
    }

    if (position_id) {
      conditions.push(`e.position_id = $${paramCount}`);
      params.push(position_id);
      paramCount++;
    }

    if (job_title_id) {
      conditions.push(`e.job_title_id = $${paramCount}`);
      params.push(job_title_id);
      paramCount++;
    }

    if (manager_id) {
      conditions.push(`e.reports_to_employee_id = $${paramCount}`);
      params.push(manager_id);
      paramCount++;
    }

    if (employment_type) {
      conditions.push(`e.employment_type = $${paramCount}`);
      params.push(employment_type);
      paramCount++;
    }

    if (employee_status) {
      conditions.push(`e.employee_status = $${paramCount}`);
      params.push(employee_status);
      paramCount++;
    }

    if (search) {
      conditions.push(`(
        e.employee_number ILIKE $${paramCount} OR
        e.first_name ILIKE $${paramCount} OR
        e.last_name ILIKE $${paramCount} OR
        e.work_email ILIKE $${paramCount}
      )`);
      params.push(`%${search}%`);
      paramCount++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM hrm_employees e
      ${whereClause}
    `;
    const countResult = await client.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get employees with related data
    params.push(limit, offset);
    const employeesQuery = `
      SELECT 
        e.*,
        o.organization_name,
        d.department_name,
        p.position_name,
        jt.job_title_name,
        sg.grade_name as salary_grade_name,
        m.first_name || ' ' || m.last_name as manager_name,
        (
          SELECT COUNT(*) FROM hrm_employees 
          WHERE reports_to_employee_id = e.employee_id AND is_active = true
        ) as direct_reports_count
      FROM hrm_employees e
      LEFT JOIN hrm_organizations o ON e.organization_id = o.organization_id
      LEFT JOIN hrm_departments d ON e.department_id = d.department_id
      LEFT JOIN hrm_positions p ON e.position_id = p.position_id
      LEFT JOIN hrm_job_titles jt ON e.job_title_id = jt.job_title_id
      LEFT JOIN hrm_salary_grades sg ON e.salary_grade_id = sg.salary_grade_id
      LEFT JOIN hrm_employees m ON e.reports_to_employee_id = m.employee_id
      ${whereClause}
      ORDER BY e.employee_number ASC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    const result = await client.query(employeesQuery, params);

    // Get summary statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_employees,
        COUNT(CASE WHEN employee_status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN employee_status = 'on_leave' THEN 1 END) as on_leave_count,
        COUNT(CASE WHEN employee_status = 'suspended' THEN 1 END) as suspended_count,
        COUNT(CASE WHEN employment_type = 'full_time' THEN 1 END) as full_time_count,
        COUNT(CASE WHEN employment_type = 'part_time' THEN 1 END) as part_time_count,
        COUNT(CASE WHEN employment_type = 'contract' THEN 1 END) as contract_count,
        ROUND(AVG(current_salary), 2) as avg_salary,
        COUNT(CASE WHEN hire_date > CURRENT_DATE - INTERVAL '90 days' THEN 1 END) as new_hires_90_days
      FROM hrm_employees
      WHERE is_active = true
    `;
    const statsResult = await client.query(statsQuery);

    return NextResponse.json({
      employees: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      summary: statsResult.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees", details: error.message },
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

    // Required fields
    const {
      first_name,
      last_name,
      organization_id,
      department_id,
      position_id,
      job_title_id,
      employment_type,
      hire_date,
      work_email,
    } = body;

    if (
      !first_name ||
      !last_name ||
      !organization_id ||
      !department_id ||
      !position_id ||
      !job_title_id ||
      !employment_type ||
      !hire_date ||
      !work_email
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: first_name, last_name, organization_id, department_id, position_id, job_title_id, employment_type, hire_date, work_email",
        },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // Generate employee number
    const maxNumberResult = await client.query(`
      SELECT employee_number 
      FROM hrm_employees 
      ORDER BY employee_id DESC 
      LIMIT 1
    `);

    let nextNumber = 1;
    if (maxNumberResult.rows.length > 0) {
      const lastNumber = maxNumberResult.rows[0].employee_number;
      const numMatch = lastNumber.match(/\d+$/);
      if (numMatch) {
        nextNumber = parseInt(numMatch[0]) + 1;
      }
    }
    const employee_number = `EMP-${String(nextNumber).padStart(5, "0")}`;

    // Insert employee
    const insertQuery = `
      INSERT INTO hrm_employees (
        employee_number, first_name, middle_name, last_name, preferred_name,
        date_of_birth, gender, marital_status, nationality,
        national_id, passport_number, passport_expiry,
        personal_email, work_email, mobile_phone, work_phone,
        address_line1, address_line2, city, state_province, postal_code, country,
        organization_id, department_id, position_id, job_title_id,
        reports_to_employee_id, dotted_line_manager_id,
        employment_type, employee_status, hire_date, confirmation_date,
        salary_grade_id, current_salary, currency, pay_frequency,
        bank_name, bank_account_number, bank_routing_number,
        user_id, username, photo_url,
        created_by
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12,
        $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22,
        $23, $24, $25, $26,
        $27, $28,
        $29, $30, $31, $32,
        $33, $34, $35, $36,
        $37, $38, $39,
        $40, $41, $42,
        $43
      )
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      employee_number,
      first_name,
      body.middle_name || null,
      last_name,
      body.preferred_name || null,
      body.date_of_birth || null,
      body.gender || null,
      body.marital_status || null,
      body.nationality || null,
      body.national_id || null,
      body.passport_number || null,
      body.passport_expiry || null,
      body.personal_email || null,
      work_email,
      body.mobile_phone || null,
      body.work_phone || null,
      body.address_line1 || null,
      body.address_line2 || null,
      body.city || null,
      body.state_province || null,
      body.postal_code || null,
      body.country || null,
      organization_id,
      department_id,
      position_id,
      job_title_id,
      body.reports_to_employee_id || null,
      body.dotted_line_manager_id || null,
      employment_type,
      body.employee_status || "active",
      hire_date,
      body.confirmation_date || null,
      body.salary_grade_id || null,
      body.current_salary || null,
      body.currency || "USD",
      body.pay_frequency || "monthly",
      body.bank_name || null,
      body.bank_account_number || null,
      body.bank_routing_number || null,
      body.user_id || null,
      body.username || null,
      body.photo_url || null,
      body.created_by || null,
    ]);

    const employee = result.rows[0];

    // Create employment history record for hire
    await client.query(
      `
      INSERT INTO hrm_employment_history (
        employee_id, change_type, effective_date,
        new_organization_id, new_department_id, new_position_id, new_job_title_id,
        new_manager_id, new_salary, new_employment_type, new_status,
        reason, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `,
      [
        employee.employee_id,
        "hire",
        hire_date,
        organization_id,
        department_id,
        position_id,
        job_title_id,
        body.reports_to_employee_id || null,
        body.current_salary || null,
        employment_type,
        "active",
        "New hire",
        body.created_by || null,
      ]
    );

    await client.query("COMMIT");

    // Fetch complete employee data
    const completeQuery = `
      SELECT 
        e.*,
        o.organization_name,
        d.department_name,
        p.position_name,
        jt.job_title_name,
        sg.grade_name as salary_grade_name,
        m.first_name || ' ' || m.last_name as manager_name
      FROM hrm_employees e
      LEFT JOIN hrm_organizations o ON e.organization_id = o.organization_id
      LEFT JOIN hrm_departments d ON e.department_id = d.department_id
      LEFT JOIN hrm_positions p ON e.position_id = p.position_id
      LEFT JOIN hrm_job_titles jt ON e.job_title_id = jt.job_title_id
      LEFT JOIN hrm_salary_grades sg ON e.salary_grade_id = sg.salary_grade_id
      LEFT JOIN hrm_employees m ON e.reports_to_employee_id = m.employee_id
      WHERE e.employee_id = $1
    `;
    const completeResult = await client.query(completeQuery, [
      employee.employee_id,
    ]);

    return NextResponse.json(completeResult.rows[0], { status: 201 });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
