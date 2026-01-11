import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get("status")

  try {
    const client = await pool.connect()

    try {
      // Fetch employees with related data
      let query = `
        SELECT 
          e.*,
          u.first_name, u.last_name, u.email,
          d.name as department_name,
          p.title as position_title,
          m_user.first_name as manager_first_name,
          m_user.last_name as manager_last_name
        FROM employees e
        LEFT JOIN users u ON e.user_id = u.id
        LEFT JOIN departments d ON e.department_id = d.id
        LEFT JOIN positions p ON e.position_id = p.id
        LEFT JOIN employees m ON e.manager_id = m.id
        LEFT JOIN users m_user ON m.user_id = m_user.id
        WHERE 1=1
      `

      const params: any[] = []
      if (status && status !== "all") {
        query += ` AND e.employment_status = $1`
        params.push(status)
      }

      query += ` ORDER BY e.employee_number DESC`

      const result = await client.query(query, params)

      // Format employees data
      const employees = result.rows.map((row) => ({
        id: row.id,
        employee_number: row.employee_number,
        user: {
          first_name: row.first_name,
          last_name: row.last_name,
          email: row.email,
        },
        department: {
          id: row.department_id,
          name: row.department_name,
        },
        position: {
          id: row.position_id,
          title: row.position_title,
        },
        manager_id: row.manager_id,
        manager: row.manager_id ? {
          first_name: row.manager_first_name,
          last_name: row.manager_last_name,
        } : null,
        employment_type: row.employment_type,
        employment_status: row.employment_status,
        hire_date: row.hire_date,
        phone: row.phone,
        salary: parseFloat(row.salary || 0),
        date_of_birth: row.date_of_birth,
        gender: row.gender,
        address: row.address,
        city: row.city,
        province: row.province,
      }))

      // Get statistics
      const statsQuery = `
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE employment_status = 'Active') as active,
          COUNT(*) FILTER (WHERE employment_status = 'Probation') as probation,
          COUNT(*) FILTER (WHERE employment_status IN ('Terminated', 'Resigned')) as inactive
        FROM employees
      `
      const statsResult = await client.query(statsQuery)
      const stats = {
        total: parseInt(statsResult.rows[0].total),
        active: parseInt(statsResult.rows[0].active),
        probation: parseInt(statsResult.rows[0].probation),
        inactive: parseInt(statsResult.rows[0].inactive),
      }

      return NextResponse.json({
        employees,
        stats,
        total: employees.length,
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const client = await pool.connect()

    try {
      await client.query("BEGIN")

      // Create user first if email provided
      let userId = body.user_id
      if (!userId && body.email) {
        const userResult = await client.query(
          `INSERT INTO users (email, first_name, last_name, created_at)
           VALUES ($1, $2, $3, NOW())
           RETURNING id`,
          [body.email, body.first_name, body.last_name]
        )
        userId = userResult.rows[0].id
      }

      // Generate employee number if not provided
      let employeeNumber = body.employee_number
      if (!employeeNumber) {
        const countResult = await client.query("SELECT COUNT(*) as count FROM employees")
        const count = parseInt(countResult.rows[0].count) + 1
        employeeNumber = `EMP${String(count).padStart(5, "0")}`
      }

      // Insert employee
      const result = await client.query(
        `INSERT INTO employees (
          user_id, employee_number, department_id, position_id, manager_id,
          date_of_birth, gender, marital_status, nationality, phone,
          emergency_contact_name, emergency_contact_phone,
          address, city, province, postal_code,
          employment_type, employment_status, hire_date, probation_end_date,
          salary, salary_currency, bank_name, bank_account_number, bank_account_holder,
          npwp, bpjs_kesehatan, bpjs_ketenagakerjaan,
          notes, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12,
          $13, $14, $15, $16,
          $17, $18, $19, $20,
          $21, $22, $23, $24, $25,
          $26, $27, $28,
          $29, NOW(), NOW()
        ) RETURNING *`,
        [
          userId,
          employeeNumber,
          body.department_id || null,
          body.position_id || null,
          body.manager_id || null,
          body.date_of_birth || null,
          body.gender || null,
          body.marital_status || null,
          body.nationality || "Indonesia",
          body.phone || null,
          body.emergency_contact_name || null,
          body.emergency_contact_phone || null,
          body.address || null,
          body.city || null,
          body.province || null,
          body.postal_code || null,
          body.employment_type || "Full-time",
          body.employment_status || "Probation",
          body.hire_date || new Date().toISOString().split("T")[0],
          body.probation_end_date || null,
          body.salary || 0,
          body.salary_currency || "IDR",
          body.bank_name || null,
          body.bank_account_number || null,
          body.bank_account_holder || null,
          body.npwp || null,
          body.bpjs_kesehatan || null,
          body.bpjs_ketenagakerjaan || null,
          body.notes || null,
        ]
      )

      // Initialize leave balances for new employee
      const leaveTypesResult = await client.query("SELECT id, days_per_year FROM leave_types WHERE is_active = true")
      const currentYear = new Date().getFullYear()

      for (const leaveType of leaveTypesResult.rows) {
        await client.query(
          `INSERT INTO employee_leave_balances (employee_id, leave_type_id, year, total_days, used_days, remaining_days, created_at)
           VALUES ($1, $2, $3, $4, 0, $4, NOW())`,
          [result.rows[0].id, leaveType.id, currentYear, leaveType.days_per_year]
        )
      }

      await client.query("COMMIT")

      return NextResponse.json(
        {
          message: "Employee created successfully",
          employee: result.rows[0],
        },
        { status: 201 }
      )
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
  }
}
