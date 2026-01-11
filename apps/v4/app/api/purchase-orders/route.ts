import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"
import { WorkflowEngine } from "@/lib/workflow-engine"

const pool = new Pool({
  user: process.env.DB_USER || "mac",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ocean-erp",
  password: process.env.DB_PASSWORD || "",
  port: parseInt(process.env.DB_PORT || "5432"),
})

// GET /api/purchase-orders - List purchase orders
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const supplier_id = searchParams.get("supplier_id")
    const summary = searchParams.get("summary") === "true"

    if (summary) {
      // Get PO summary from view
      let query = "SELECT * FROM purchase_order_summary WHERE 1=1"
      const params: any[] = []
      let paramCount = 1

      if (status) {
        query += ` AND status = $${paramCount}`
        params.push(status)
        paramCount++
      }

      if (supplier_id) {
        query += ` AND supplier_id = $${paramCount}`
        params.push(supplier_id)
        paramCount++
      }

      query += " ORDER BY order_date DESC"

      const result = await pool.query(query, params)
      return NextResponse.json(result.rows)
    }

    // Get detailed PO list
    let query = `
      SELECT 
        po.*,
        s.company_name as supplier_name,
        s.supplier_code,
        w.name as warehouse_name,
        CONCAT(creator.first_name, ' ', creator.last_name) as created_by_name,
        COUNT(poi.id) as item_count
      FROM purchase_orders po
      LEFT JOIN suppliers s ON po.supplier_id = s.id
      LEFT JOIN warehouses w ON po.warehouse_id = w.id
      LEFT JOIN users creator ON po.created_by = creator.id
      LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 1

    if (status) {
      query += ` AND po.status = $${paramCount}`
      params.push(status)
      paramCount++
    }

    if (supplier_id) {
      query += ` AND po.supplier_id = $${paramCount}`
      params.push(supplier_id)
      paramCount++
    }

    query += ` GROUP BY po.id, s.company_name, s.supplier_code, w.name, creator.first_name, creator.last_name ORDER BY po.order_date DESC`

    const result = await pool.query(query, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching purchase orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch purchase orders" },
      { status: 500 }
    )
  }
}

// POST /api/purchase-orders - Create purchase order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      po_number,
      supplier_id,
      warehouse_id,
      order_date,
      expected_delivery_date,
      currency = "IDR",
      payment_terms,
      shipping_method,
      shipping_address,
      notes,
      terms_and_conditions,
      items, // Array of { product_id, quantity_ordered, unit_price, ... }
      created_by,
    } = body

    // Check if PO number exists
    const existing = await pool.query(
      "SELECT id FROM purchase_orders WHERE po_number = $1",
      [po_number]
    )

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "Purchase order number already exists" },
        { status: 400 }
      )
    }

    // Get supplier payment terms if not provided
    let finalPaymentTerms = payment_terms
    if (!finalPaymentTerms) {
      const supplierResult = await pool.query(
        "SELECT payment_terms FROM suppliers WHERE id = $1",
        [supplier_id]
      )
      finalPaymentTerms = supplierResult.rows[0]?.payment_terms || "Net 30"
    }

    // Create PO
    const poResult = await pool.query(
      `INSERT INTO purchase_orders (
        po_number, supplier_id, warehouse_id, order_date, expected_delivery_date,
        currency, payment_terms, shipping_method, shipping_address, notes,
        terms_and_conditions, status, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Draft', $12)
      RETURNING *`,
      [
        po_number, supplier_id, warehouse_id, order_date, expected_delivery_date,
        currency, finalPaymentTerms, shipping_method, shipping_address, notes,
        terms_and_conditions, created_by
      ]
    )

    const purchase_order_id = poResult.rows[0].id

    // Insert items
    if (items && items.length > 0) {
      for (const item of items) {
        await pool.query(
          `INSERT INTO purchase_order_items (
            purchase_order_id, product_id, quantity_ordered, unit_price,
            discount_percent, discount_amount, tax_percent, tax_amount,
            notes, expected_delivery_date
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            purchase_order_id,
            item.product_id,
            item.quantity_ordered,
            item.unit_price,
            item.discount_percent || 0,
            item.discount_amount || 0,
            item.tax_percent || 0,
            item.tax_amount || 0,
            item.notes,
            item.expected_delivery_date,
          ]
        )
      }
    }

    // Get complete PO with items
    const completeResult = await pool.query(
      `SELECT 
        po.*,
        s.company_name as supplier_name,
        json_agg(
          json_build_object(
            'id', poi.id,
            'product_id', poi.product_id,
            'product_name', p.name,
            'sku', p.sku,
            'quantity_ordered', poi.quantity_ordered,
            'unit_price', poi.unit_price,
            'line_total', poi.line_total
          )
        ) as items
      FROM purchase_orders po
      LEFT JOIN suppliers s ON po.supplier_id = s.id
      LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
      LEFT JOIN products p ON poi.product_id = p.id
      WHERE po.id = $1
      GROUP BY po.id, s.company_name`,
      [purchase_order_id]
    )

    const purchaseOrder = completeResult.rows[0]

    // Start approval workflow if PO is submitted (not draft)
    if (purchaseOrder.status === 'Pending Approval' || purchaseOrder.status === 'Submitted') {
      try {
        await WorkflowEngine.startWorkflow(
          'purchase_order',
          purchase_order_id,
          created_by,
          {
            total_amount: purchaseOrder.total_amount,
            supplier_id: purchaseOrder.supplier_id,
            created_by: created_by,
            po_number: purchaseOrder.po_number
          },
          pool
        )
      } catch (workflowError) {
        console.error('Error starting workflow:', workflowError)
        // Don't fail PO creation if workflow fails
      }
    }

    return NextResponse.json(purchaseOrder, { status: 201 })
  } catch (error) {
    console.error("Error creating purchase order:", error)
    return NextResponse.json(
      { error: "Failed to create purchase order" },
      { status: 500 }
    )
  }
}
