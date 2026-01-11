import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  user: process.env.DB_USER || "mac",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ocean-erp",
  password: process.env.DB_PASSWORD || "",
  port: parseInt(process.env.DB_PORT || "5432"),
})

// GET /api/asset-management/locations - List asset locations
export async function GET(request: NextRequest) {
  try {
    const result = await pool.query(`
      SELECT 
        location_id,
        location_name,
        location_code,
        location_type,
        address
      FROM asset_locations
      WHERE 1=1
      ORDER BY location_name
    `)
    return NextResponse.json({ locations: result.rows })
  } catch (error) {
    console.error("Error fetching asset locations:", error)
    return NextResponse.json({ locations: [] })
  }
}
