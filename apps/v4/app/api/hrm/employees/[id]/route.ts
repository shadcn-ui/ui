import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/employees/[id] - Get employee details
// PUT /api/hrm/employees/[id] - Update employee
// DELETE /api/hrm/employees/[id] - Deactivate employee
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const employee_id = params.id;

    // Get employee with all related data
    const employeeQuery = `
      SELECT 
        e.*,
        o.organization_name, o.organization_code,
        d.department_name, d.department_code,
        p.position_name, p.position_code,
        jt.job_title_name, jt.job_title_code, jt.job_level, jt.job_family,
        sg.grade_name as salary_grade_name, sg.grade_code as salary_grade_code,
        m.employee_number as manager_employee_number,
        m.first_name || ' ' || m.last_name as manager_name,
        dm.first_name || ' ' || dm.last_name as dotted_line_manager_name,
        (
          SELECT COUNT(*) FROM hrm_employees 
          WHERE reports_to_employee_id = e.employee_id AND is_active = true
        ) as direct_reports_count,
        (
          SELECT json_agg(json_build_object(
            'employee_id', emp.employee_id,
            'employee_number', emp.employee_number,
            'full_name', emp.first_name || ' ' || emp.last_name,
            'job_title', jt2.job_title_name,
            'hire_date', emp.hire_date
          ))
          FROM hrm_employees emp
          LEFT JOIN hrm_job_titles jt2 ON emp.job_title_id = jt2.job_title_id
          WHERE emp.reports_to_employee_id = e.employee_id AND emp.is_active = true
        ) as direct_reports
      FROM hrm_employees e
      LEFT JOIN hrm_organizations o ON e.organization_id = o.organization_id
      LEFT JOIN hrm_departments d ON e.department_id = d.department_id
      LEFT JOIN hrm_positions p ON e.position_id = p.position_id
      LEFT JOIN hrm_job_titles jt ON e.job_title_id = jt.job_title_id
      LEFT JOIN hrm_salary_grades sg ON e.salary_grade_id = sg.salary_grade_id
      LEFT JOIN hrm_employees m ON e.reports_to_employee_id = m.employee_id
      LEFT JOIN hrm_employees dm ON e.dotted_line_manager_id = dm.employee_id
      WHERE e.employee_id = $1
    `;

    const result = await client.query(employeeQuery, [employee_id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    const employee = result.rows[0];

    // Get employment history
    const historyQuery = `
      SELECT 
        eh.*,
        prev_org.organization_name as previous_organization_name,
        new_org.organization_name as new_organization_name,
        prev_dept.department_name as previous_department_name,
        new_dept.department_name as new_department_name,
        prev_pos.position_name as previous_position_name,
        new_pos.position_name as new_position_name,
        prev_jt.job_title_name as previous_job_title_name,
        new_jt.job_title_name as new_job_title_name
      FROM hrm_employment_history eh
      LEFT JOIN hrm_organizations prev_org ON eh.previous_organization_id = prev_org.organization_id
      LEFT JOIN hrm_organizations new_org ON eh.new_organization_id = new_org.organization_id
      LEFT JOIN hrm_departments prev_dept ON eh.previous_department_id = prev_dept.department_id
      LEFT JOIN hrm_departments new_dept ON eh.new_department_id = new_dept.department_id
      LEFT JOIN hrm_positions prev_pos ON eh.previous_position_id = prev_pos.position_id
      LEFT JOIN hrm_positions new_pos ON eh.new_position_id = new_pos.position_id
      LEFT JOIN hrm_job_titles prev_jt ON eh.previous_job_title_id = prev_jt.job_title_id
      LEFT JOIN hrm_job_titles new_jt ON eh.new_job_title_id = new_jt.job_title_id
      WHERE eh.employee_id = $1
      ORDER BY eh.effective_date DESC, eh.created_at DESC
      LIMIT 20
    `;
    const historyResult = await client.query(historyQuery, [employee_id]);

    // Get emergency contacts
    const contactsQuery = `
      SELECT * FROM hrm_emergency_contacts
      WHERE employee_id = $1 AND is_active = true
      ORDER BY is_primary DESC, priority_order ASC
    `;
    const contactsResult = await client.query(contactsQuery, [employee_id]);

    // Get dependents
    const dependentsQuery = `
      SELECT * FROM hrm_dependents
      WHERE employee_id = $1 AND is_active = true
      ORDER BY relationship, date_of_birth
    `;
    const dependentsResult = await client.query(dependentsQuery, [employee_id]);

    // Get documents summary
    const documentsQuery = `
      SELECT 
        document_type,
        COUNT(*) as count,
        COUNT(CASE WHEN verification_status = 'verified' THEN 1 END) as verified_count,
        COUNT(CASE WHEN expiry_date < CURRENT_DATE THEN 1 END) as expired_count
      FROM hrm_employee_documents
      WHERE employee_id = $1 AND is_active = true
      GROUP BY document_type
    `;
    const documentsResult = await client.query(documentsQuery, [employee_id]);

    // Get certifications
    const certificationsQuery = `
      SELECT * FROM hrm_certifications
      WHERE employee_id = $1 AND is_active = true
      ORDER BY 
        CASE status
          WHEN 'active' THEN 1
          WHEN 'expired' THEN 2
          ELSE 3
        END,
        expiry_date ASC NULLS LAST
    `;
    const certificationsResult = await client.query(certificationsQuery, [employee_id]);

    // Get skills
    const skillsQuery = `
      SELECT * FROM hrm_employee_skills
      WHERE employee_id = $1 AND is_active = true
      ORDER BY is_primary_skill DESC, proficiency_score DESC
    `;
    const skillsResult = await client.query(skillsQuery, [employee_id]);

    // Get recent performance reviews
    const reviewsQuery = `
      SELECT 
        pr.*,
        r.first_name || ' ' || r.last_name as reviewer_name
      FROM hrm_performance_reviews pr
      LEFT JOIN hrm_employees r ON pr.reviewer_id = r.employee_id
      WHERE pr.employee_id = $1 AND pr.is_active = true
      ORDER BY pr.review_date DESC
      LIMIT 5
    `;
    const reviewsResult = await client.query(reviewsQuery, [employee_id]);

    return NextResponse.json({
      employee,
      employment_history: historyResult.rows,
      emergency_contacts: contactsResult.rows,
      dependents: dependentsResult.rows,
      documents_summary: documentsResult.rows,
      certifications: certificationsResult.rows,
      skills: skillsResult.rows,
      recent_reviews: reviewsResult.rows,
    });
  } catch (error: any) {
    console.error("Error fetching employee details:", error);
    return NextResponse.json(
      { error: "Failed to fetch employee details", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const employee_id = params.id;
    const body = await request.json();

    // Check if employee exists
    const checkResult = await client.query(
      "SELECT * FROM hrm_employees WHERE employee_id = $1",
      [employee_id]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    const currentEmployee = checkResult.rows[0];

    await client.query("BEGIN");

    // Build update query dynamically
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramCount = 1;

    const updatableFields = [
      "first_name", "middle_name", "last_name", "preferred_name",
      "date_of_birth", "gender", "marital_status", "nationality",
      "national_id", "passport_number", "passport_expiry",
      "driving_license", "driving_license_expiry",
      "personal_email", "work_email", "mobile_phone", "work_phone",
      "address_line1", "address_line2", "city", "state_province", "postal_code", "country",
      "organization_id", "department_id", "position_id", "job_title_id",
      "reports_to_employee_id", "dotted_line_manager_id",
      "employment_type", "employee_status", "confirmation_date",
      "salary_grade_id", "current_salary", "currency", "pay_frequency",
      "bank_name", "bank_account_number", "bank_routing_number",
      "username", "photo_url", "updated_by"
    ];

    for (const field of updatableFields) {
      if (body[field] !== undefined) {
        updateFields.push(`${field} = $${paramCount}`);
        updateValues.push(body[field]);
        paramCount++;
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    updateValues.push(employee_id);
    const updateQuery = `
      UPDATE hrm_employees 
      SET ${updateFields.join(", ")}
      WHERE employee_id = $${paramCount}
      RETURNING *
    `;

    await client.query(updateQuery, updateValues);

    // Check if employment details changed and create history record
    const hasOrgChange = body.organization_id && body.organization_id !== currentEmployee.organization_id;
    const hasDeptChange = body.department_id && body.department_id !== currentEmployee.department_id;
    const hasPosChange = body.position_id && body.position_id !== currentEmployee.position_id;
    const hasJobTitleChange = body.job_title_id && body.job_title_id !== currentEmployee.job_title_id;
    const hasManagerChange = body.reports_to_employee_id && body.reports_to_employee_id !== currentEmployee.reports_to_employee_id;
    const hasSalaryChange = body.current_salary && body.current_salary !== currentEmployee.current_salary;
    const hasStatusChange = body.employee_status && body.employee_status !== currentEmployee.employee_status;

    if (hasOrgChange || hasDeptChange || hasPosChange || hasJobTitleChange || hasManagerChange || hasSalaryChange || hasStatusChange) {
      let changeType = "status_change";
      if (hasPosChange || hasJobTitleChange) {
        changeType = body.current_salary > currentEmployee.current_salary ? "promotion" : 
                     body.current_salary < currentEmployee.current_salary ? "demotion" : "transfer";
      } else if (hasSalaryChange) {
        changeType = "salary_change";
      } else if (hasOrgChange || hasDeptChange) {
        changeType = "transfer";
      }

      await client.query(
        `
        INSERT INTO hrm_employment_history (
          employee_id, change_type, effective_date,
          previous_organization_id, previous_department_id, previous_position_id, previous_job_title_id,
          previous_manager_id, previous_salary, previous_employment_type, previous_status,
          new_organization_id, new_department_id, new_position_id, new_job_title_id,
          new_manager_id, new_salary, new_employment_type, new_status,
          reason, created_by
        ) VALUES (
          $1, $2, CURRENT_DATE,
          $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18,
          $19, $20
        )
      `,
        [
          employee_id,
          changeType,
          currentEmployee.organization_id,
          currentEmployee.department_id,
          currentEmployee.position_id,
          currentEmployee.job_title_id,
          currentEmployee.reports_to_employee_id,
          currentEmployee.current_salary,
          currentEmployee.employment_type,
          currentEmployee.employee_status,
          body.organization_id || currentEmployee.organization_id,
          body.department_id || currentEmployee.department_id,
          body.position_id || currentEmployee.position_id,
          body.job_title_id || currentEmployee.job_title_id,
          body.reports_to_employee_id || currentEmployee.reports_to_employee_id,
          body.current_salary || currentEmployee.current_salary,
          body.employment_type || currentEmployee.employment_type,
          body.employee_status || currentEmployee.employee_status,
          body.change_reason || "Updated via API",
          body.updated_by || null,
        ]
      );
    }

    await client.query("COMMIT");

    // Fetch updated employee data
    const updatedQuery = `
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
    const result = await client.query(updatedQuery, [employee_id]);

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: "Failed to update employee", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const employee_id = params.id;
    const { searchParams } = new URL(request.url);
    const termination_reason = searchParams.get("reason");

    // Check if employee exists
    const checkResult = await client.query(
      "SELECT * FROM hrm_employees WHERE employee_id = $1",
      [employee_id]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    // Soft delete - set is_active to false and update status
    const result = await client.query(
      `
      UPDATE hrm_employees 
      SET 
        is_active = false,
        employee_status = 'terminated',
        termination_date = CURRENT_DATE,
        last_working_date = CURRENT_DATE,
        termination_reason = $2
      WHERE employee_id = $1
      RETURNING *
    `,
      [employee_id, termination_reason || "No reason provided"]
    );

    return NextResponse.json({
      message: "Employee terminated successfully",
      employee: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error terminating employee:", error);
    return NextResponse.json(
      { error: "Failed to terminate employee", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
