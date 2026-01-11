import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  user: process.env.DB_USER || "mac",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ocean-erp",
  password: process.env.DB_PASSWORD || "",
  port: parseInt(process.env.DB_PORT || "5432"),
})

// GET /api/suppliers - List suppliers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const summary = searchParams.get("summary") === "true"

    if (summary) {
      // Get supplier performance summary
      const result = await pool.query(
        "SELECT * FROM supplier_performance_summary ORDER BY total_purchase_value DESC"
      )
      return NextResponse.json(result.rows)
    }

    let query = `
      SELECT 
        s.*,
        CONCAT(creator.first_name, ' ', creator.last_name) as created_by_name
      FROM suppliers s
      LEFT JOIN users creator ON s.created_by = creator.id
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 1

    if (status) {
      query += ` AND s.status = $${paramCount}`
      params.push(status)
      paramCount++
    }

    if (search) {
      query += ` AND (s.company_name ILIKE $${paramCount} OR s.supplier_code ILIKE $${paramCount} OR s.email ILIKE $${paramCount})`
      params.push(`%${search}%`)
      paramCount++
    }

    query += ` ORDER BY s.company_name`

    const result = await pool.query(query, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching suppliers:", error)
    return NextResponse.json(
      { error: "Failed to fetch suppliers" },
      { status: 500 }
    )
  }
}

// POST /api/suppliers - Create supplier
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      supplier_code,
      company_name,
      contact_person,
      email,
      phone,
      website,
      address,
      city,
      state,
      country,
      postal_code,
      tax_id,
      payment_terms = "Net 30",
      currency = "IDR",
      credit_limit = 0,
      status = "Active",
      rating = 0,
      notes,
      tags,
      created_by,
    } = body

    // Check if supplier code exists
    const existing = await pool.query(
      "SELECT id FROM suppliers WHERE supplier_code = $1",
      [supplier_code]
    )

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "Supplier code already exists" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `INSERT INTO suppliers (
        supplier_code, company_name, contact_person, email, phone, website,
        address, city, state, country, postal_code, tax_id, payment_terms,
        currency, credit_limit, status, rating, notes, tags, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *`,
      [
        supplier_code, company_name, contact_person, email, phone, website,
        address, city, state, country, postal_code, tax_id, payment_terms,
        currency, credit_limit, status, rating, notes, tags, created_by
      ]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating supplier:", error)
    return NextResponse.json(
      { error: "Failed to create supplier" },
      { status: 500 }
    )
  }
}
