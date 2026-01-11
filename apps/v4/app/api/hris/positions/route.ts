import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

// GET /api/hris/positions - Get all positions
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const departmentId = searchParams.get("department_id")

  try {
    const client = await pool.connect()

    try {
      let query = `
        SELECT p.id, p.title, p.code, p.level, p.department_id, d.name as department_name
        FROM positions p
        LEFT JOIN departments d ON p.department_id = d.id
        WHERE 1=1
      `
      const params: any[] = []

      if (departmentId) {
        query += ` AND p.department_id = $1`
        params.push(departmentId)
      }

      query += ` ORDER BY p.title ASC`

      const result = await client.query(query, params)

      return NextResponse.json({
        positions: result.rows,
        total: result.rows.length,
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error fetching positions:", error)
    return NextResponse.json(
      { error: "Failed to fetch positions" },
      { status: 500 }
    )
  }
}
