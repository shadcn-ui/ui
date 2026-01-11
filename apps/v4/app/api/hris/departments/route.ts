import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

// GET /api/hris/departments - Get all departments
export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect()

    try {
      const result = await client.query(
        `SELECT id, name, code, description, manager_id
         FROM departments
         ORDER BY name ASC`
      )

      return NextResponse.json({
        departments: result.rows,
        total: result.rows.length,
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error fetching departments:", error)
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    )
  }
}
