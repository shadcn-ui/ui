import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET(request: Request) {
  const client = await pool.connect()
  
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let query = `
      SELECT 
        lr.*,
        e.employee_number,
        CONCAT(u.first_name, ' ', u.last_name) as employee_name,
        d.name as department_name,
        lt.name as leave_type_name
      FROM leave_requests lr
      JOIN employees e ON lr.employee_id = e.id
      JOIN users u ON e.user_id = u.id
      LEFT JOIN departments d ON e.department_id = d.id
      JOIN leave_types lt ON lr.leave_type_id = lt.id
    `

    const conditions: string[] = []
    const values: any[] = []

    if (status && status !== "all") {
      conditions.push(`lr.status = $${values.length + 1}`)
      values.push(status)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`
    }

    query += ` ORDER BY lr.requested_date DESC`

    const result = await client.query(query, values)

    // Calculate statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_requests,
        COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending_requests,
        COUNT(CASE WHEN status = 'Approved' AND EXTRACT(MONTH FROM start_date) = EXTRACT(MONTH FROM CURRENT_DATE) THEN 1 END) as approved_requests,
        (SELECT COUNT(*) FROM public_holidays WHERE EXTRACT(YEAR FROM holiday_date) = EXTRACT(YEAR FROM CURRENT_DATE)) as total_holidays
      FROM leave_requests
    `
    const statsResult = await client.query(statsQuery)
    const stats = statsResult.rows[0]

    return NextResponse.json({
      requests: result.rows,
      stats: {
        total_requests: parseInt(stats.total_requests),
        pending_requests: parseInt(stats.pending_requests),
        approved_requests: parseInt(stats.approved_requests),
        total_holidays: parseInt(stats.total_holidays),
      },
    })
  } catch (error) {
    console.error("Error fetching leave requests:", error)
    return NextResponse.json(
      { error: "Failed to fetch leave requests" },
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
      employee_id,
      leave_type_id,
      start_date,
      end_date,
      days,
      reason,
      status = "Pending",
    } = body

    await client.query("BEGIN")

    const insertQuery = `
      INSERT INTO leave_requests (
        employee_id,
        leave_type_id,
        start_date,
        end_date,
        days,
        reason,
        status,
        requested_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE)
      RETURNING *
    `

    const result = await client.query(insertQuery, [
      employee_id,
      leave_type_id,
      start_date,
      end_date,
      days,
      reason,
      status,
    ])

    await client.query("COMMIT")

    return NextResponse.json(
      { request: result.rows[0], message: "Leave request submitted successfully" },
      { status: 201 }
    )
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error creating leave request:", error)
    return NextResponse.json(
      { error: "Failed to submit leave request" },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
