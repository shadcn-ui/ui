import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"
import { recordIssue } from "@/lib/issues"
import { buildErrorEnvelope } from "@/lib/errors/standard-error"
import { productionLockResponse } from "@/lib/runtime-flags"

import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"
import { recordIssue } from "@/lib/issues"
import { buildErrorEnvelope } from "@/lib/errors/standard-error"

const pool = new Pool({
  user: process.env.DB_USER || "mac",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ocean-erp",
  password: process.env.DB_PASSWORD || "",
  port: parseInt(process.env.DB_PORT || "5432"),
})

async function getPeriodForDate(dateIso: string) {
  const res = await pool.query(
    `SELECT id, status, inventory_closed
     FROM accounting_periods
     WHERE $1::date BETWEEN start_date AND end_date
     LIMIT 1`,
    [dateIso]
  )
  return res.rows[0] || null
}

// GET /api/inventory - Get inventory levels and movements
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type") || "levels"
    const product_id = searchParams.get("product_id")
    const warehouse_id = searchParams.get("warehouse_id")
    const low_stock = searchParams.get("low_stock") === "true"

    if (type === "levels") {
      let query = `
        SELECT 
          i.*,
          p.sku,
          p.name as product_name,
          p.reorder_level,
          pc.name as category_name,
          w.name as warehouse_name,
          w.code as warehouse_code,
          wl.location_code,
          CASE 
            WHEN i.quantity_available <= 0 THEN 'Out of Stock'
            WHEN i.quantity_available <= p.reorder_level THEN 'Low Stock'
            ELSE 'In Stock'
          END as stock_status
        FROM inventory i
        JOIN products p ON i.product_id = p.id
        LEFT JOIN product_categories pc ON p.category_id = pc.id
        JOIN warehouses w ON i.warehouse_id = w.id
        LEFT JOIN warehouse_locations wl ON i.location_id = wl.id
        WHERE p.deleted_at IS NULL
      `
      const params: any[] = []
      let paramCount = 1

      if (product_id) {
        query += ` AND i.product_id = $${paramCount}`
        params.push(product_id)
        paramCount++
      }

      if (warehouse_id) {
        query += ` AND i.warehouse_id = $${paramCount}`
        params.push(warehouse_id)
        paramCount++
      }

      if (low_stock) {
        query += ` AND i.quantity_available <= p.reorder_level`
      }

      query += ` ORDER BY p.name, w.name`

      try {
        const result = await pool.query(query, params)
        return NextResponse.json(result.rows)
      } catch (error: any) {
        console.error('Error fetching inventory levels:', error)
        const envelope = buildErrorEnvelope({
          error_code: 'INVALID_STOCK_MOVEMENT',
          human_message: 'Failed to fetch inventory levels.',
          suggested_next_action: 'Retry with a valid inventory query or contact an administrator.',
          trace_path: null,
          reference: { inventory_close_id: 'inventory-levels' },
        })
        return NextResponse.json(envelope, { status: 500 })
      }
    }

    if (type === "movements") {
      let query = `
        SELECT 
          sm.*,
          p.sku,
          p.name as product_name,
          w.warehouse_name as warehouse_name,
          fw.warehouse_name as from_warehouse_name,
          tw.warehouse_name as to_warehouse_name,
          CONCAT(u.first_name, ' ', u.last_name) as created_by_name
        FROM stock_movements sm
        JOIN products p ON sm.product_id = p.id
        LEFT JOIN warehouses w ON sm.warehouse_id = w.id
        LEFT JOIN warehouses fw ON sm.from_warehouse_id = fw.id
        LEFT JOIN warehouses tw ON sm.to_warehouse_id = tw.id
        LEFT JOIN users u ON sm.created_by = u.id
        WHERE 1=1
      `
      const params: any[] = []
      let paramCount = 1

      if (product_id) {
        query += ` AND sm.product_id = $${paramCount}`
        params.push(product_id)
        paramCount++
      }

      if (warehouse_id) {
        query += ` AND sm.warehouse_id = $${paramCount}`
        params.push(warehouse_id)
        paramCount++
      }

      query += ` ORDER BY sm.movement_date DESC LIMIT 100`

      try {
        const result = await pool.query(query, params)
        return NextResponse.json(result.rows)
      } catch (err: any) {
        if (err && err.code === '42P01') {
          console.warn('stock_movements table missing — falling back to inventory_movements')
          const fallbackQuery = `
            SELECT
              im.id,
              p.sku,
              p.name as product_name,
              il.name as warehouse_name,
              im.movement_type,
              im.quantity,
              im.unit_cost,
              NULL as balance_before,
              NULL as balance_after,
              im.created_at as movement_date,
              CONCAT(u.first_name, ' ', u.last_name) as created_by_name,
              im.notes
            FROM inventory_movements im
            JOIN products p ON im.product_id = p.id
            LEFT JOIN inventory_locations il ON im.location_id = il.id
            LEFT JOIN users u ON im.created_by = u.id
            ORDER BY im.created_at DESC
            LIMIT 100
          `
          try {
            const fb = await pool.query(fallbackQuery)
            return NextResponse.json(fb.rows)
          } catch (fbErr: any) {
            console.error('Fallback inventory_movements query failed:', fbErr)
            const envelope = buildErrorEnvelope({
              error_code: 'INTERNAL_ERROR',
              human_message: 'Failed to fetch inventory movements.',
              suggested_next_action: 'Retry after fixing the schema or contact an administrator.',
              trace_path: null,
              reference: { inventory_close_id: 'inventory-movements' },
            })
            return NextResponse.json(envelope, { status: 500 })
          }
        }

        console.error('Error fetching inventory movements:', err)
        const envelope = buildErrorEnvelope({
          error_code: 'INTERNAL_ERROR',
          human_message: 'Failed to fetch inventory movements.',
          suggested_next_action: 'Retry with a valid inventory query or contact an administrator.',
          trace_path: null,
          reference: { inventory_close_id: 'inventory-movements' },
        })
        return NextResponse.json(envelope, { status: 500 })
      }
    }

    if (type === "summary") {
      const result = await pool.query("SELECT * FROM product_inventory_summary ORDER BY product_name")
      return NextResponse.json(result.rows)
    }

    if (type === "low_stock") {
      const result = await pool.query("SELECT * FROM low_stock_products ORDER BY shortage_quantity DESC")
      return NextResponse.json(result.rows)
    }

    const envelope = buildErrorEnvelope({
      error_code: 'INVALID_STOCK_MOVEMENT',
      human_message: 'Invalid type parameter for inventory query.',
      suggested_next_action: 'Use type=levels, movements, summary, or low_stock and retry.',
      trace_path: null,
      reference: { inventory_close_id: 'inventory-query' },
    })
    return NextResponse.json(envelope, { status: 400 })
  } catch (error) {
    console.error("Error fetching inventory:", error)
    const envelope = buildErrorEnvelope({
      error_code: 'INTERNAL_ERROR',
      human_message: 'Failed to fetch inventory.',
      suggested_next_action: 'Retry the request or contact an administrator.',
      trace_path: null,
      reference: { inventory_close_id: 'inventory-query' },
    })
    return NextResponse.json(envelope, { status: 500 })
  }
}

// POST /api/inventory - Create/update inventory or record movement
export async function POST(request: NextRequest) {
  const locked = productionLockResponse('Inventory adjustment or movement', { inventory_close_id: 'inventory-post' })
  if (locked) return locked

  let issueClient: any = null
  try {
    const body = await request.json()
    const { action = "adjust" } = body

    issueClient = await pool.connect()

    if (action === "adjust") {
      const {
        product_id,
        warehouse_id,
        location_id,
        quantity_on_hand,
        quantity_reserved = 0,
        quantity_on_order = 0,
        batch_number,
        serial_numbers,
        unit_cost,
      } = body

      const period = await getPeriodForDate(new Date().toISOString())
      if (!period || (period.status && period.status.toUpperCase() !== "OPEN")) {
        await recordIssue(issueClient, {
          type: "INVENTORY",
          reference_id: String(product_id || "inventory-adjust"),
          error_code: "INVENTORY_PERIOD_CLOSED",
          period_id: period?.id,
          human_message: "Inventory period is closed for adjustments.",
          suggested_next_action: "Post adjustment in next open period.",
          source: "api",
        })

        const envelope = buildErrorEnvelope({
          error_code: "INVENTORY_PERIOD_CLOSED",
          human_message: "Inventory period is closed for adjustments.",
          suggested_next_action: "Post adjustment in next open period.",
          trace_path: `/erp/trace/journal/${encodeURIComponent(String(product_id || "inventory-adjust"))}`,
          reference: {
            period_id: period?.id ? String(period.id) : undefined,
            inventory_close_id: String(product_id || "inventory-adjust"),
          },
        })

        return NextResponse.json(envelope, { status: 403 })
      }

      if (period.inventory_closed) {
        await recordIssue(issueClient, {
          type: "INVENTORY",
          reference_id: String(product_id || "inventory-adjust"),
          error_code: "INVENTORY_PERIOD_CLOSED",
          period_id: period.id,
          human_message: "Inventory is closed for this period.",
          suggested_next_action: "Post adjustment in next open period.",
          source: "api",
        })

        const envelope = buildErrorEnvelope({
          error_code: "INVENTORY_PERIOD_CLOSED",
          human_message: "Inventory is closed for this period.",
          suggested_next_action: "Post adjustment in next open period.",
          trace_path: `/erp/trace/journal/${encodeURIComponent(String(product_id || "inventory-adjust"))}`,
          reference: {
            period_id: String(period.id),
            inventory_close_id: String(product_id || "inventory-adjust"),
          },
        })

        return NextResponse.json(envelope, { status: 403 })
      }

      const existing = await pool.query(
        `SELECT * FROM inventory 
         WHERE product_id = $1 AND warehouse_id = $2 
         AND ($3::VARCHAR IS NULL OR batch_number = $3)`,
        [product_id, warehouse_id, batch_number]
      )

      if (existing.rows.length > 0) {
        const result = await pool.query(
          `UPDATE inventory 
           SET quantity_on_hand = $1,
               quantity_reserved = $2,
               quantity_on_order = $3,
               location_id = $4,
               unit_cost = $5,
               serial_numbers = $6,
               last_movement_date = CURRENT_TIMESTAMP
           WHERE id = $7
           RETURNING *`,
          [
            quantity_on_hand,
            quantity_reserved,
            quantity_on_order,
            location_id,
            unit_cost,
            serial_numbers,
            existing.rows[0].id,
          ]
        )
        return NextResponse.json(result.rows[0])
      }

      const result = await pool.query(
        `INSERT INTO inventory (
          product_id, warehouse_id, location_id, quantity_on_hand,
          quantity_reserved, quantity_on_order, batch_number,
          serial_numbers, unit_cost
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [
          product_id,
          warehouse_id,
          location_id,
          quantity_on_hand,
          quantity_reserved,
          quantity_on_order,
          batch_number,
          serial_numbers,
          unit_cost,
        ]
      )
      return NextResponse.json(result.rows[0], { status: 201 })
    }

    if (action === "movement") {
      const {
        product_id,
        warehouse_id,
        movement_type,
        quantity,
        unit_cost = 0,
        batch_number,
        serial_numbers,
        reference_type,
        reference_id,
        reference_number,
        from_warehouse_id,
        to_warehouse_id,
        from_location_id,
        to_location_id,
        notes,
        created_by,
        movement_date,
      } = body

      const referenceId = reference_number || reference_id || `movement-${product_id || 'unknown'}`

      if (!product_id || !warehouse_id || !movement_type || !quantity) {
        await recordIssue(issueClient, {
          type: "INVENTORY",
          reference_id: referenceId,
          error_code: "INVALID_STOCK_MOVEMENT",
          human_message: "Missing required fields for stock movement.",
          suggested_next_action: "Post adjustment in next open period.",
          source: "api",
        })

        const envelope = buildErrorEnvelope({
          error_code: "INVALID_STOCK_MOVEMENT",
          human_message: "Missing required fields for stock movement.",
          suggested_next_action: "Post adjustment in next open period.",
          trace_path: `/erp/trace/journal/${encodeURIComponent(String(referenceId))}`,
          reference: { inventory_close_id: String(referenceId) },
        })

        return NextResponse.json(envelope, { status: 400 })
      }

      const movementDate = movement_date || new Date().toISOString()
      const period = await getPeriodForDate(movementDate)
      if (!period || (period.status && period.status.toUpperCase() !== "OPEN")) {
        await recordIssue(issueClient, {
          type: "INVENTORY",
          reference_id: referenceId,
          error_code: "INVENTORY_PERIOD_CLOSED",
          period_id: period?.id,
          human_message: "The accounting period is closed.",
          suggested_next_action: "Post adjustment in next open period.",
          source: "api",
        })

        const envelope = buildErrorEnvelope({
          error_code: "INVENTORY_PERIOD_CLOSED",
          human_message: "The accounting period is closed.",
          suggested_next_action: "Post adjustment in next open period.",
          trace_path: `/erp/trace/journal/${encodeURIComponent(String(referenceId))}`,
          reference: { period_id: period?.id ? String(period.id) : undefined, inventory_close_id: String(referenceId) },
        })

        return NextResponse.json(envelope, { status: 403 })
      }

      if (period.inventory_closed) {
        await recordIssue(issueClient, {
          type: "INVENTORY",
          reference_id: referenceId,
          error_code: "INVENTORY_PERIOD_CLOSED",
          period_id: period.id,
          human_message: "Inventory is closed for this period.",
          suggested_next_action: "Post adjustment in next open period.",
          source: "api",
        })

        const envelope = buildErrorEnvelope({
          error_code: "INVENTORY_PERIOD_CLOSED",
          human_message: "Inventory is closed for this period.",
          suggested_next_action: "Post adjustment in next open period.",
          trace_path: `/erp/trace/journal/${encodeURIComponent(String(referenceId))}`,
          reference: { period_id: String(period.id), inventory_close_id: String(referenceId) },
        })

        return NextResponse.json(envelope, { status: 403 })
      }

      const inventoryResult = await pool.query(
        `SELECT quantity_on_hand FROM inventory 
         WHERE product_id = $1 AND warehouse_id = $2 
         AND ($3::VARCHAR IS NULL OR batch_number = $3)`,
        [product_id, warehouse_id, batch_number]
      )

      const balance_before = inventoryResult.rows[0]?.quantity_on_hand || 0
      const balance_after = movement_type.includes("Increase") || movement_type.includes("Receipt") || movement_type === "Transfer In"
        ? balance_before + quantity
        : balance_before - quantity

      const result = await pool.query(
        `INSERT INTO stock_movements (
          product_id, warehouse_id, movement_type, quantity, unit_cost,
          total_value, balance_before, balance_after, batch_number,
          serial_numbers, reference_type, reference_id, reference_number,
          from_warehouse_id, to_warehouse_id, from_location_id, to_location_id,
          notes, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *`,
        [
          product_id,
          warehouse_id,
          movement_type,
          quantity,
          unit_cost,
          quantity * unit_cost,
          balance_before,
          balance_after,
          batch_number,
          serial_numbers,
          reference_type,
          reference_id,
          reference_number,
          from_warehouse_id,
          to_warehouse_id,
          from_location_id,
          to_location_id,
          notes,
          created_by,
        ]
      )

      return NextResponse.json(result.rows[0], { status: 201 })
    }

    const envelope = buildErrorEnvelope({
      error_code: "INVALID_STOCK_MOVEMENT",
      human_message: "Invalid action for inventory endpoint.",
      suggested_next_action: "Post adjustment in next open period.",
      trace_path: `/erp/trace/journal/inventory-action`,
      reference: { inventory_close_id: "inventory-action" },
    })
    return NextResponse.json(envelope, { status: 400 })
  } catch (error) {
    console.error("Error managing inventory:", error)
    const envelope = buildErrorEnvelope({
      error_code: "INTERNAL_ERROR",
      human_message: "Failed to manage inventory.",
      suggested_next_action: "Post adjustment in next open period.",
      trace_path: null,
      reference: {},
    })
    return NextResponse.json(envelope, { status: 500 })
  } finally {
    if (issueClient) {
      issueClient.release()
    }
  }
}
