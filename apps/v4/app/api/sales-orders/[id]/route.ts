import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { createSalesOrderJournalEntry, createPaymentJournalEntry } from '@/lib/accounting-integration'

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
    const { id } = await params
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM sales_orders WHERE id = $1',
        [id]
      )
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Sales order not found' }, { status: 404 })
      }
      return NextResponse.json({ order: result.rows[0] })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('GET /api/sales-orders/[id] error', error)
    return NextResponse.json({ error: 'Failed to fetch sales order' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const client = await pool.connect()
    try {
      // Get current order data to detect status changes
      const currentOrder = await client.query(
        'SELECT * FROM sales_orders WHERE id = $1',
        [id]
      )
      
      if (currentOrder.rows.length === 0) {
        return NextResponse.json({ error: 'Sales order not found' }, { status: 404 })
      }
      
      const oldOrder = currentOrder.rows[0]
      const oldStatus = oldOrder.status
      const oldPaymentStatus = oldOrder.payment_status
      
      const fields: string[] = []
      const values: any[] = []
      let idx = 1

      // Build dynamic update query
      const allowedFields = [
        'customer_id', 'opportunity_id',
        'status', 'payment_status',
        'order_date', 'expected_ship_date', 'actual_ship_date',
        'subtotal', 'tax_amount', 'shipping_amount', 'total_amount',
        'notes', 'payment_date', 'tracking_number', 'shipping_status',
        'external_order_id', 'source_platform'
      ]

      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          fields.push(`${field} = $${idx}`)
          values.push(body[field])
          idx++
        }
      }

      if (fields.length === 0) {
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
      }

      values.push(id)
      const query = `UPDATE sales_orders SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`
      
      const result = await client.query(query, values)
      const updatedOrder = result.rows[0]
      
      // Accounting Integration: Handle status changes following proper accounting principles
      const newStatus = body.status || oldStatus
      const newPaymentStatus = body.payment_status || oldPaymentStatus
      
      // Normalize status values to lowercase for comparison
      const normalizedOldStatus = oldStatus?.toLowerCase()
      const normalizedNewStatus = newStatus?.toLowerCase()
      const normalizedOldPayment = oldPaymentStatus?.toLowerCase()
      const normalizedNewPayment = newPaymentStatus?.toLowerCase()
      
      // Get customer name for journal entries if needed
      let customerName = 'Unknown Customer'
      if (normalizedNewStatus === 'confirmed' && normalizedOldStatus !== 'confirmed') {
        const customerResult = await client.query(
          'SELECT company_name FROM customers WHERE id = $1',
          [updatedOrder.customer_id]
        )
        customerName = customerResult.rows[0]?.company_name || 'Unknown Customer'
      }
      
      // Check if order was just confirmed
      const orderJustConfirmed = normalizedOldStatus !== 'confirmed' && normalizedNewStatus === 'confirmed'
      const paymentJustReceived = normalizedOldPayment !== 'paid' && normalizedNewPayment === 'paid'
      
      if (orderJustConfirmed && parseFloat(updatedOrder.total_amount) > 0) {
        // Order just became Confirmed
        
        if (normalizedNewPayment === 'paid') {
          // CASE 1: Order confirmed AND already paid = Cash Sale
          // Debit: Cash/Bank, Credit: Sales Revenue
          const { createCashSaleJournalEntry } = await import('@/lib/accounting-integration')
          const journalResult = await createCashSaleJournalEntry(
            pool,
            updatedOrder.id,
            updatedOrder.order_number,
            customerName,
            parseFloat(updatedOrder.total_amount),
            updatedOrder.order_date
          )
          
          if (journalResult.success) {
            console.log(`✓ Cash sale journal entry created: ${updatedOrder.order_number}`)
          } else {
            console.error('Warning: Failed to create cash sale entry:', journalResult.error)
          }
        } else {
          // CASE 2: Order confirmed but NOT paid = Credit Sale  
          // Debit: Accounts Receivable, Credit: Sales Revenue
          const journalResult = await createSalesOrderJournalEntry(
            pool,
            updatedOrder.id,
            updatedOrder.order_number,
            customerName,
            parseFloat(updatedOrder.total_amount),
            updatedOrder.order_date
          )
          
          if (journalResult.success) {
            console.log(`✓ Credit sale journal entry created: ${updatedOrder.order_number}`)
          } else {
            console.error('Warning: Failed to create credit sale entry:', journalResult.error)
          }
        }
      } else if (paymentJustReceived && normalizedNewStatus === 'confirmed' && parseFloat(updatedOrder.total_amount) > 0) {
        // CASE 3: Order was already confirmed, now payment received
        // Debit: Cash/Bank, Credit: Accounts Receivable
        const customerResult = await client.query(
          'SELECT company_name FROM customers WHERE id = $1',
          [updatedOrder.customer_id]
        )
        customerName = customerResult.rows[0]?.company_name || 'Unknown Customer'
        
        const { createPaymentJournalEntry } = await import('@/lib/accounting-integration')
        const paymentResult = await createPaymentJournalEntry(
          pool,
          updatedOrder.order_number,
          customerName,
          parseFloat(updatedOrder.total_amount),
          new Date().toISOString().split('T')[0],
          'Cash'
        )
        
        if (paymentResult.success) {
          console.log(`✓ Payment received journal entry created: ${updatedOrder.order_number}`)
        } else {
          console.error('Warning: Failed to create payment entry:', paymentResult.error)
        }
      }
      
      return NextResponse.json({ 
        message: 'Sales order updated', 
        order: updatedOrder
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('PATCH /api/sales-orders/[id] error', error)
    return NextResponse.json({ error: 'Failed to update sales order' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = await pool.connect()
    try {
      await client.query('DELETE FROM sales_orders WHERE id = $1', [id])
      return NextResponse.json({ message: 'Sales order deleted' })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('DELETE /api/sales-orders/[id] error', error)
    return NextResponse.json({ error: 'Failed to delete sales order' }, { status: 500 })
  }
}
