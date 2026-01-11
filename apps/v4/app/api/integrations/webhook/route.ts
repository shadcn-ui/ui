import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

// Webhook endpoint for receiving external events
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const headers = Object.fromEntries(request.headers.entries())
    
    const client = await pool.connect()

    try {
      // Determine integration source from headers or payload
      const integrationId = headers['x-integration-id'] || payload.source || 'unknown'
      const eventType = headers['x-event-type'] || payload.event_type || 'webhook'

      // Log the webhook event
      const logQuery = `
        INSERT INTO integration_logs (integration_id, action, status, details, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING id
      `
      
      await client.query(logQuery, [
        integrationId,
        eventType,
        'received',
        JSON.stringify({ payload, headers: { 'user-agent': headers['user-agent'] } })
      ])

      // Process webhook based on event type
      switch (eventType) {
        case 'order.created':
          // Handle new order from e-commerce platform
          await handleNewOrder(client, payload)
          break
        
        case 'payment.success':
          // Handle successful payment
          await handlePaymentSuccess(client, payload)
          break
        
        case 'shipment.tracking':
          // Handle shipment tracking update
          await handleShipmentTracking(client, payload)
          break
        
        default:
          console.log(`Unhandled event type: ${eventType}`)
      }

      return NextResponse.json({
        success: true,
        message: 'Webhook received and processed',
        eventType
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}

async function handleNewOrder(client: any, payload: any) {
  // Example: Create sales order from e-commerce platform
  const orderQuery = `
    INSERT INTO sales_orders (
      order_number,
      customer_id,
      order_date,
      status,
      total_amount,
      external_order_id,
      source_platform,
      created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    ON CONFLICT (external_order_id) DO NOTHING
  `
  
  await client.query(orderQuery, [
    payload.order_number || `WEB-${Date.now()}`,
    1, // Default customer for now
    new Date(),
    'pending',
    payload.total_amount || 0,
    payload.order_id,
    payload.platform || 'ecommerce',
  ])
}

async function handlePaymentSuccess(client: any, payload: any) {
  // Example: Update order payment status
  const updateQuery = `
    UPDATE sales_orders
    SET payment_status = 'paid', payment_date = NOW(), updated_at = NOW()
    WHERE external_order_id = $1
  `
  
  await client.query(updateQuery, [payload.order_id])
}

async function handleShipmentTracking(client: any, payload: any) {
  // Example: Update shipment tracking
  const updateQuery = `
    UPDATE sales_orders
    SET tracking_number = $1, shipping_status = $2, updated_at = NOW()
    WHERE external_order_id = $3
  `
  
  await client.query(updateQuery, [
    payload.tracking_number,
    payload.status || 'in_transit',
    payload.order_id
  ])
}
