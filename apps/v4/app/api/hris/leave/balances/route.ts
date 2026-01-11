import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET() {
  const client = await pool.connect()
  
  try {
    const query = `
      SELECT 
        CONCAT(u.first_name, ' ', u.last_name) as employee_name,
        lt.name as leave_type_name,
        elb.total_days,
        elb.used_days,
        (elb.total_days - elb.used_days) as remaining_days
      FROM employee_leave_balances elb
      JOIN employees e ON elb.employee_id = e.id
      JOIN users u ON e.user_id = u.id
      JOIN leave_types lt ON elb.leave_type_id = lt.id
      WHERE elb.year = EXTRACT(YEAR FROM CURRENT_DATE)
      ORDER BY u.first_name, u.last_name, lt.name
    `

    const result = await client.query(query)

    return NextResponse.json({
      balances: result.rows,
    })
  } catch (error) {
    console.error("Error fetching leave balances:", error)
    return NextResponse.json(
      { error: "Failed to fetch leave balances" },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
