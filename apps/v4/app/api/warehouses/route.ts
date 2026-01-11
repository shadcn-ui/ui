import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  user: process.env.DB_USER || "mac",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ocean-erp",
  password: process.env.DB_PASSWORD || "",
  port: parseInt(process.env.DB_PORT || "5432"),
})

// GET /api/warehouses - List warehouses
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    let query = `
      SELECT 
        w.*,
        CONCAT(m.first_name, ' ', m.last_name) as manager_name,
        m.email as manager_email,
        COUNT(DISTINCT i.product_id) as product_count,
        COALESCE(SUM(i.quantity_on_hand), 0) as total_items_count,
        COALESCE(SUM(i.total_value), 0) as total_inventory_value
      FROM warehouses w
      LEFT JOIN users m ON w.manager_id = m.id
      LEFT JOIN inventory i ON w.id = i.warehouse_id
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 1

    if (status) {
      query += ` AND w.status = $${paramCount}`
      params.push(status)
      paramCount++
    }

    if (type) {
      query += ` AND w.type = $${paramCount}`
      params.push(type)
      paramCount++
    }

    query += ` GROUP BY w.id, m.first_name, m.last_name, m.email ORDER BY w.is_primary DESC, w.name`

    const result = await pool.query(query, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching warehouses:", error)
    return NextResponse.json(
      { error: "Failed to fetch warehouses" },
      { status: 500 }
    )
  }
}

// POST /api/warehouses - Create warehouse
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      code,
      name,
      type = "Standard",
      address,
      city,
      state,
      country,
      postal_code,
      latitude,
      longitude,
      manager_id,
      phone,
      email,
      total_capacity,
      capacity_unit = "sqm",
      status = "Active",
      is_primary = false,
      created_by,
    } = body

    // Check if code exists
    const existing = await pool.query(
      "SELECT id FROM warehouses WHERE code = $1",
      [code]
    )

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "Warehouse code already exists" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `INSERT INTO warehouses (
        code, name, type, address, city, state, country, postal_code,
        latitude, longitude, manager_id, phone, email, total_capacity,
        capacity_unit, status, is_primary, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *`,
      [
        code, name, type, address, city, state, country, postal_code,
        latitude, longitude, manager_id, phone, email, total_capacity,
        capacity_unit, status, is_primary, created_by
      ]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating warehouse:", error)
    return NextResponse.json(
      { error: "Failed to create warehouse" },
      { status: 500 }
    )
  }
}
