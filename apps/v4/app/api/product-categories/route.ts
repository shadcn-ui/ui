import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  user: process.env.DB_USER || "mac",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ocean-erp",
  password: process.env.DB_PASSWORD || "",
  port: parseInt(process.env.DB_PORT || "5432"),
})

// GET /api/product-categories - List all product categories
export async function GET(request: NextRequest) {
  try {
    const result = await pool.query(
      `SELECT id, name, description, parent_id, created_at
       FROM product_categories
       WHERE is_active = true
       ORDER BY name ASC`
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching product categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch product categories" },
      { status: 500 }
    )
  }
}
