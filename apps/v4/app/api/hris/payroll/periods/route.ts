import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET(request: Request) {
  const client = await pool.connect()
  
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    // Build query with filters
    let query = `
      SELECT 
        pp.*,
        COUNT(DISTINCT pr.id) as total_employees,
        COALESCE(SUM(pr.gross_salary), 0) as total_gross,
        COALESCE(SUM(pr.total_deductions), 0) as total_deductions,
        COALESCE(SUM(pr.net_salary), 0) as total_net
      FROM payroll_periods pp
      LEFT JOIN payroll_records pr ON pp.id = pr.period_id
    `

    const conditions: string[] = []
    const values: any[] = []

    if (status && status !== "all") {
      conditions.push(`pp.status = $${values.length + 1}`)
      values.push(status)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`
    }

    query += `
      GROUP BY pp.id
      ORDER BY pp.start_date DESC
    `

    const result = await client.query(query, values)

    // Calculate statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_periods,
        COUNT(CASE WHEN status IN ('Calculated', 'Approved') THEN 1 END) as current_period,
        (SELECT COUNT(DISTINCT employee_id) FROM employees WHERE employment_status = 'Active') as total_employees,
        COALESCE((
          SELECT SUM(net_salary) 
          FROM payroll_records pr
          JOIN payroll_periods pp ON pr.payroll_period_id = pp.id
          WHERE pp.status IN ('Calculated', 'Approved')
          AND pp.start_date >= DATE_TRUNC('month', CURRENT_DATE)
        ), 0) as total_payroll
      FROM payroll_periods
    `
    const statsResult = await client.query(statsQuery)
    const stats = statsResult.rows[0]

    return NextResponse.json({
      periods: result.rows,
      stats: {
        total_periods: parseInt(stats.total_periods),
        current_period: parseInt(stats.current_period),
        total_employees: parseInt(stats.total_employees),
        total_payroll: parseFloat(stats.total_payroll),
      },
    })
  } catch (error) {
    console.error("Error fetching payroll periods:", error)
    return NextResponse.json(
      { error: "Failed to fetch payroll periods" },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

export async function POST(request: Request) {
  const client = await pool.connect()

  try {
    const body = await request.json()
    const {
      period_name,
      start_date,
      end_date,
      payment_date,
      status = "Draft",
    } = body

    await client.query("BEGIN")

    const insertQuery = `
      INSERT INTO payroll_periods (
        period_name,
        start_date,
        end_date,
        payment_date,
        status
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `

    const result = await client.query(insertQuery, [
      period_name,
      start_date,
      end_date,
      payment_date,
      status,
    ])

    await client.query("COMMIT")

    return NextResponse.json(
      { period: result.rows[0], message: "Payroll period created successfully" },
      { status: 201 }
    )
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error creating payroll period:", error)
    return NextResponse.json(
      { error: "Failed to create payroll period" },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
