import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  user: process.env.DB_USER || "mac",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ocean-erp",
  password: process.env.DB_PASSWORD || "",
  port: parseInt(process.env.DB_PORT || "5432"),
})

// GET /api/products - List products with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category_id = searchParams.get("category_id")
    const status = searchParams.get("status") || "Active"
    const search = searchParams.get("search")
    const low_stock = searchParams.get("low_stock") === "true"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = (page - 1) * limit

    let query = `
      SELECT 
        p.*,
        pc.name as category_name,
        p.current_stock as total_stock,
        0 as on_order_quantity,
        CASE 
          WHEN p.current_stock <= 0 THEN 'Out of Stock'
          WHEN p.current_stock <= p.min_stock_level THEN 'Low Stock'
          ELSE 'In Stock'
        END as stock_status
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      WHERE p.is_active = true
    `
    const params: any[] = []
    let paramCount = 1

    if (category_id) {
      query += ` AND p.category_id = $${paramCount}`
      params.push(category_id)
      paramCount++
    }

    if (status && status !== "Active") {
      query += ` AND p.is_active = false`
    }

    if (search) {
      query += ` AND (p.name ILIKE $${paramCount} OR p.sku ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`
      params.push(`%${search}%`)
      paramCount++
    }

    query += ` ORDER BY p.created_at DESC`

    if (low_stock) {
      query += ` AND p.current_stock <= p.min_stock_level`
    }

    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`
    params.push(limit, offset)

    const result = await pool.query(query, params)

    // Get total count
    let countQuery = `
      SELECT COUNT(p.id) as total
      FROM products p
      WHERE p.is_active = true
    `
    const countParams: any[] = []
    let countParamNum = 1

    if (category_id) {
      countQuery += ` AND p.category_id = $${countParamNum}`
      countParams.push(category_id)
      countParamNum++
    }

    if (status && status !== "Active") {
      countQuery += ` AND p.is_active = false`
    }

    if (search) {
      countQuery += ` AND (p.name ILIKE $${countParamNum} OR p.sku ILIKE $${countParamNum} OR p.description ILIKE $${countParamNum})`
      countParams.push(`%${search}%`)
      countParamNum++
    }

    if (low_stock) {
      countQuery += ` AND p.current_stock <= p.min_stock_level`
    }

    const countResult = await pool.query(countQuery, countParams)
    const total = parseInt(countResult.rows[0]?.total || "0")

    return NextResponse.json({
      products: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      sku,
      name,
      description,
      category_id,
      unit_price,
      cost_price = 0,
      weight,
      dimensions,
      barcode,
      min_stock_level = 0,
      max_stock_level = 0,
      current_stock = 0,
      is_active = true,
    } = body

    // Validate required fields
    if (!sku || !name || !unit_price) {
      return NextResponse.json(
        { error: "sku, name, and unit_price are required" },
        { status: 400 }
      )
    }

    // Check if SKU already exists
    const existingProduct = await pool.query(
      "SELECT id FROM products WHERE sku = $1",
      [sku]
    )

    if (existingProduct.rows.length > 0) {
      return NextResponse.json(
        { error: "Product with this SKU already exists" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `INSERT INTO products (
        sku, name, description, category_id, unit_price, cost_price,
        weight, dimensions, barcode, min_stock_level, max_stock_level,
        current_stock, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
      RETURNING *`,
      [
        sku, name, description, category_id, 
        parseFloat(unit_price), parseFloat(cost_price),
        weight ? parseFloat(weight) : null, 
        dimensions, barcode, 
        parseInt(min_stock_level), parseInt(max_stock_level),
        parseInt(current_stock), is_active
      ]
    )

    return NextResponse.json({ 
      message: 'Product created successfully',
      product: result.rows[0] 
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { 
        error: "Failed to create product",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
