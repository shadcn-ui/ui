import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { createSalesOrderJournalEntry } from '@/lib/accounting-integration'

const pool = new Pool({
  user: process.env.DB_USER || 'mac',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ocean-erp',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customer_id')

    const client = await pool.connect()
    try {
      let query = `
        SELECT 
          so.id, 
          so.order_number, 
          c.company_name as customer,
          c.contact_email as customer_email, 
          c.contact_phone as customer_phone,
          so.subtotal, 
          so.tax_amount, 
          so.shipping_amount,
          so.total_amount,
          so.status, 
          so.payment_status,
          so.order_date, 
          so.expected_ship_date as expected_delivery_date, 
          so.actual_ship_date as actual_delivery_date,
          so.opportunity_id, 
          so.notes,
          so.created_at, 
          so.updated_at
        FROM sales_orders so
        LEFT JOIN customers c ON so.customer_id = c.id`
      
      const params: any[] = []
      if (customerId) {
        query += ` WHERE so.customer_id = $1`
        params.push(customerId)
      }
      
      query += ` ORDER BY so.order_date DESC, so.created_at DESC`
      
      const result = await client.query(query, params)
      return NextResponse.json({ orders: result.rows })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to fetch sales orders:', error)
    return NextResponse.json({ orders: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      customer_id,
      customer_data, // New: Optional customer data to auto-create
      opportunity_id,
      subtotal = 0,
      tax_amount = 0,
      shipping_amount = 0,
      total_amount = 0,
      status = 'draft',
      payment_status = 'pending',
      order_date,
      expected_ship_date,
      notes,
      created_by,
    } = body

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      let finalCustomerId = customer_id

      // Auto-create customer if customer_data provided but no customer_id
      if (!customer_id && customer_data) {
        const {
          company_name,
          contact_first_name,
          contact_last_name,
          contact_email,
          contact_phone,
          billing_address,
          shipping_address
        } = customer_data

        // Validate required customer fields
        if (!company_name || !contact_first_name || !contact_last_name) {
          await client.query('ROLLBACK')
          return NextResponse.json({ 
            error: 'Customer data must include company_name, contact_first_name, and contact_last_name'
          }, { status: 400 })
        }

        // Generate customer number
        const customerNumberResult = await client.query(
          `SELECT COALESCE(MAX(CAST(SUBSTRING(customer_number FROM 6) AS INTEGER)), 0) + 1 as next_num
           FROM customers 
           WHERE customer_number ~ '^CUST-[0-9]+$'`
        )
        const customerNumber = `CUST-${customerNumberResult.rows[0].next_num.toString().padStart(6, '0')}`

        // Create customer
        const customerResult = await client.query(
          `INSERT INTO customers (
            customer_number,
            company_name,
            contact_first_name,
            contact_last_name,
            contact_email,
            contact_phone,
            billing_address,
            shipping_address,
            created_at,
            updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
          RETURNING id`,
          [
            customerNumber,
            company_name,
            contact_first_name,
            contact_last_name,
            contact_email || null,
            contact_phone || null,
            billing_address || null,
            shipping_address || null
          ]
        )

        finalCustomerId = customerResult.rows[0].id
      }

      // Convert Lead to Customer if opportunity_id is provided
      if (opportunity_id && !customer_id) {
        // Get the lead associated with this opportunity
        const opportunityResult = await client.query(
          `SELECT lead_id FROM opportunities WHERE id = $1`,
          [opportunity_id]
        )

        if (opportunityResult.rows.length > 0 && opportunityResult.rows[0].lead_id) {
          const leadId = opportunityResult.rows[0].lead_id

          // Get lead details
          const leadResult = await client.query(
            `SELECT * FROM leads WHERE id = $1`,
            [leadId]
          )

          if (leadResult.rows.length > 0) {
            const lead = leadResult.rows[0]

            // Generate customer number
            const customerNumberResult = await client.query(
              `SELECT COALESCE(MAX(CAST(SUBSTRING(customer_number FROM 6) AS INTEGER)), 0) + 1 as next_num
               FROM customers 
               WHERE customer_number ~ '^CUST-[0-9]+$'`
            )
            const customerNumber = `CUST-${customerNumberResult.rows[0].next_num.toString().padStart(6, '0')}`

            // Create customer from lead
            const customerResult = await client.query(
              `INSERT INTO customers (
                customer_number,
                company_name,
                contact_first_name,
                contact_last_name,
                contact_email,
                contact_phone,
                billing_address,
                billing_city,
                billing_state,
                billing_zip_code,
                billing_country,
                created_at,
                updated_at
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
              RETURNING id`,
              [
                customerNumber,
                lead.company || `${lead.first_name} ${lead.last_name}`,
                lead.first_name || '',
                lead.last_name || '',
                lead.email || null,
                lead.phone || null,
                lead.address || null,
                lead.city || null,
                lead.state || null,
                lead.zip_code || null,
                lead.country || null
              ]
            )

            finalCustomerId = customerResult.rows[0].id

            // Update lead status to indicate it's been converted
            await client.query(
              `UPDATE leads SET status_id = (
                SELECT id FROM lead_statuses WHERE name ILIKE '%converted%' LIMIT 1
              ), updated_at = NOW() WHERE id = $1`,
              [leadId]
            )

            // Mark opportunity as won
            await client.query(
              `UPDATE opportunities 
               SET is_won = true, is_closed = true, closed_at = NOW(), updated_at = NOW() 
               WHERE id = $1`,
              [opportunity_id]
            )
          }
        }
      }

      // Validate customer_id exists (either provided or created)
      if (!finalCustomerId) {
        await client.query('ROLLBACK')
        return NextResponse.json({ 
          error: 'customer_id or customer_data is required'
        }, { status: 400 })
      }
      // Generate order number
      const orderNumberResult = await client.query(
        `SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4) AS INTEGER)), 0) + 1 as next_num
         FROM sales_orders 
         WHERE order_number ~ '^SO-[0-9]+$'`
      )
      const orderNumber = `SO-${orderNumberResult.rows[0].next_num.toString().padStart(6, '0')}`

      const result = await client.query(
        `INSERT INTO sales_orders (
          order_number,
          customer_id,
          opportunity_id,
          subtotal,
          tax_amount,
          shipping_amount,
          total_amount,
          status,
          payment_status,
          order_date,
          expected_ship_date,
          notes,
          created_by,
          created_at,
          updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()
        ) RETURNING *`,
        [
          orderNumber,
          finalCustomerId,
          opportunity_id || null,
          parseFloat(subtotal),
          parseFloat(tax_amount),
          parseFloat(shipping_amount),
          parseFloat(total_amount),
          status,
          body.payment_status || 'pending',
          order_date || new Date().toISOString().split('T')[0],
          expected_ship_date || null,
          notes || null,
          created_by || null,
        ]
      )
      
      const newOrder = result.rows[0]
      
      // Get customer name BEFORE committing transaction
      const customerResult = await client.query(
        'SELECT company_name FROM customers WHERE id = $1',
        [finalCustomerId]
      )
      const customerName = customerResult.rows[0]?.company_name || 'Unknown Customer'
      
      // Commit the sales order transaction
      await client.query('COMMIT')
      
      // Create journal entries based on order status and payment status
      // Following proper accounting principles for sales transactions
      // Note: Journal entries are created AFTER order commit to avoid transaction conflicts
      const normalizedStatus = status?.toLowerCase()
      const normalizedPaymentStatus = payment_status?.toLowerCase()
      
      const journalWarnings: string[] = []

      if (normalizedStatus === 'confirmed' && parseFloat(total_amount) > 0) {
        console.log(`\ud83d\udcca Order ${orderNumber}: Creating journal entry (status: ${status}, payment: ${payment_status})`);

        try {
          if (normalizedPaymentStatus === 'paid') {
            // Sales Order Confirmed AND Paid = Direct Cash Sale
            // Debit: Cash/Bank, Credit: Sales Revenue
            console.log(`\ud83d\udcb5 Creating cash sale entry for ${orderNumber}`);
            const { createCashSaleJournalEntry } = await import('@/lib/accounting-integration')
            const journalResult = await createCashSaleJournalEntry(
              pool,
              newOrder.id,
              orderNumber,
              customerName,
              parseFloat(total_amount),
              newOrder.order_date
            )

            if (journalResult.success) {
              console.log(`✓ Cash sale journal entry created for order: ${orderNumber}`)
            } else {
              console.error('\u274c Failed to create cash sale entry:', journalResult.error)
              journalWarnings.push(`Cash sale entry failed: ${journalResult.error}`)
            }
          } else {
            // Sales Order Confirmed but NOT Paid = Credit Sale
            // Debit: Accounts Receivable, Credit: Sales Revenue
            console.log(`\ud83d\udccb Creating credit sale entry for ${orderNumber}`);
            const journalResult = await createSalesOrderJournalEntry(
              pool,
              newOrder.id,
              orderNumber,
              customerName,
              parseFloat(total_amount),
              newOrder.order_date
            )

            if (journalResult.success) {
              console.log(`✓ Credit sale journal entry created for order: ${orderNumber}`)
            } else {
              console.error('\u274c Failed to create credit sale entry:', journalResult.error)
              journalWarnings.push(`Credit sale entry failed: ${journalResult.error}`)
            }
          }
        } catch (err) {
          console.error('Unexpected error creating journal entry:', err)
          journalWarnings.push(String(err))
        }
      }
      
      // Determine the success message
      let message = 'Sales order created'
      if (opportunity_id && !customer_id && finalCustomerId) {
        message = 'Sales order created and lead converted to customer'
      } else if (!customer_id && customer_data) {
        message = 'Sales order created with new customer'
      }
      
      // Note: Journal entry creation removed - should be handled by accounting module
      // when order status changes to 'confirmed' or when invoice is created
      
      const responseBody: any = { message, order: newOrder, customer_id: finalCustomerId }
      if (journalWarnings.length > 0) {
        responseBody.journal_warnings = journalWarnings
      }

      return NextResponse.json(responseBody, { status: 201 })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to create sales order:', error)
    return NextResponse.json({ 
      error: 'Failed to create sales order',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
