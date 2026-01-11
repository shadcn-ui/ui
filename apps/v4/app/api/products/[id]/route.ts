import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  user: process.env.DB_USER || "mac",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ocean-erp",
  password: process.env.DB_PASSWORD || "",
  port: parseInt(process.env.DB_PORT || "5432"),
})

// GET /api/products/[id] - Get product details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const result = await pool.query(
      `SELECT 
        p.*,
        pc.name as category_name,
        CONCAT(creator.first_name, ' ', creator.last_name) as created_by_name,
        CONCAT(updater.first_name, ' ', updater.last_name) as updated_by_name
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      LEFT JOIN users creator ON p.created_by = creator.id
      LEFT JOIN users updater ON p.updated_by = updater.id
      WHERE p.id = $1 AND p.deleted_at IS NULL`,
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Get inventory across warehouses
    const inventory = await pool.query(
      `SELECT 
        i.*,
        w.name as warehouse_name,
        w.code as warehouse_code,
        wl.location_code
      FROM inventory i
      LEFT JOIN warehouses w ON i.warehouse_id = w.id
      LEFT JOIN warehouse_locations wl ON i.location_id = wl.id
      WHERE i.product_id = $1
      ORDER BY w.name`,
      [id]
    )

    // Get recent stock movements
    const movements = await pool.query(
      `SELECT 
        sm.*,
        w.name as warehouse_name,
        CONCAT(u.first_name, ' ', u.last_name) as created_by_name
      FROM stock_movements sm
      LEFT JOIN warehouses w ON sm.warehouse_id = w.id
      LEFT JOIN users u ON sm.created_by = u.id
      WHERE sm.product_id = $1
      ORDER BY sm.movement_date DESC
      LIMIT 20`,
      [id]
    )

    // Get suppliers for this product
    const suppliers = await pool.query(
      `SELECT 
        sp.*,
        s.company_name,
        s.supplier_code,
        s.email,
        s.phone,
        s.rating
      FROM supplier_products sp
      LEFT JOIN suppliers s ON sp.supplier_id = s.id
      WHERE sp.product_id = $1 AND sp.is_active = true
      ORDER BY sp.is_preferred DESC, sp.supplier_price ASC`,
      [id]
    )

    return NextResponse.json({
      product: result.rows[0],
      inventory: inventory.rows,
      recent_movements: movements.rows,
      suppliers: suppliers.rows,
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}

// PATCH /api/products/[id] - Update product
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const allowedFields = [
      "name", "description", "category_id", "unit_price", "cost_price",
      "currency", "unit_of_measure", "reorder_level", "reorder_quantity",
      "min_order_quantity", "max_order_quantity", "barcode", "manufacturer",
      "brand", "model_number", "weight", "dimensions", "primary_image_url",
      "images_urls", "status", "is_serialized", "is_batch_tracked",
      "tags", "specifications", "updated_by"
    ]

    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1

    Object.keys(body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${paramCount}`)
        values.push(body[key])
        paramCount++
      }
    })

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      )
    }

    // Add updated_at
    updates.push(`updated_at = CURRENT_TIMESTAMP`)

    values.push(id)
    const result = await pool.query(
      `UPDATE products 
       SET ${updates.join(", ")}
       WHERE id = $${paramCount} AND deleted_at IS NULL
       RETURNING *`,
      values
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Soft delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const searchParams = request.nextUrl.searchParams
    const deleted_by = searchParams.get("deleted_by")

    const result = await pool.query(
      `UPDATE products 
       SET deleted_at = CURRENT_TIMESTAMP, deleted_by = $1
       WHERE id = $2 AND deleted_at IS NULL
       RETURNING id, sku, name`,
      [deleted_by, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Product deleted successfully",
      product: result.rows[0],
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
