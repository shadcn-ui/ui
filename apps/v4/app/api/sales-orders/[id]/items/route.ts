import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import React from 'react'

const pool = new Pool({
  user: process.env.DB_USER || 'mac',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ocean-erp',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM sales_order_items WHERE sales_order_id = $1 ORDER BY id',
        [orderId]
      )
      return NextResponse.json({ items: result.rows })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('GET /api/sales-orders/[id]/items error', error)
    return NextResponse.json({ items: [] })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    const body = await request.json()
    
    const {
      product_id,
      quantity = 1,
      unit_price = 0,
    } = body

    // Validate required fields
    if (!product_id) {
      return NextResponse.json(
        { error: "product_id is required" },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    try {
      const qty = parseFloat(quantity)
      const price = parseFloat(unit_price)
      const lineTotal = qty * price

      const result = await client.query(
        `INSERT INTO sales_order_items (
          sales_order_id,
          product_id,
          quantity,
          unit_price,
          line_total,
          shipped_quantity,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, 0, NOW(), NOW()) 
        RETURNING *`,
        [
          orderId,
          product_id,
          qty,
          price,
          lineTotal
        ]
      )

      // Recalculate order totals
      const totalsResult = await client.query(
        `SELECT 
          COALESCE(SUM(line_total), 0) as subtotal
        FROM sales_order_items WHERE sales_order_id = $1`,
        [orderId]
      )
      
      const { subtotal } = totalsResult.rows[0]
      const taxRate = 0.11 // 11% PPN Indonesia
      const taxAmount = parseFloat(subtotal) * taxRate
      const total = parseFloat(subtotal) + taxAmount

      await client.query(
        `UPDATE sales_orders 
         SET subtotal = $1, tax_amount = $2, total_amount = $3, updated_at = NOW() 
         WHERE id = $4`,
        [subtotal, taxAmount, total, orderId]
      )

      return NextResponse.json({ 
        message: 'Order item added', 
        item: result.rows[0] 
      }, { status: 201 })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('POST /api/sales-orders/[id]/items error', error)
    return NextResponse.json({ error: 'Failed to add order item' }, { status: 500 })
  }
}
