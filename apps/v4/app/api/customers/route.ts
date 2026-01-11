import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.DB_USER || 'mac',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ocean-erp',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
})

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '100')
    const sortBy = url.searchParams.get('sort_by') || 'created_at'
    const sortDir = (url.searchParams.get('sort_dir') || 'desc').toLowerCase() === 'asc' ? 'ASC' : 'DESC'

    const offset = (Math.max(page, 1) - 1) * Math.max(limit, 1)

    const allowedSort = ['created_at', 'company_name', 'total_revenue']
    const sortColumn = allowedSort.includes(sortBy) ? sortBy : 'created_at'

    const client = await pool.connect()
    try {
      // Aggregate subquery for orders
      const result = await client.query(
        `SELECT
          c.id,
          c.customer_number,
          c.company_name,
          (COALESCE(c.contact_first_name, '') || ' ' || COALESCE(c.contact_last_name, ''))::text AS contact_person,
          c.contact_email AS email,
          c.contact_phone AS phone,
          'Business' AS customer_type,
          CASE WHEN c.is_active THEN 'Active' ELSE 'Inactive' END AS customer_status,
          c.billing_city,
          c.billing_state,
          c.billing_country,
          c.credit_limit,
          c.payment_terms,
          COALESCE(o.total_orders, 0) AS total_orders,
          COALESCE(o.total_revenue, 0) AS total_revenue,
          c.created_at,
          c.updated_at
        FROM customers c
        LEFT JOIN (
          SELECT customer_id, COUNT(*) AS total_orders, SUM(COALESCE(total_amount,0)) AS total_revenue
          FROM sales_orders
          WHERE status IS DISTINCT FROM 'Cancelled'
          GROUP BY customer_id
        ) o ON o.customer_id = c.id
        ORDER BY ${sortColumn} ${sortDir}
        LIMIT $1 OFFSET $2
        `,
        [limit, offset]
      )

      const rows = result.rows.map(r => ({
        ...r,
        status: r.customer_status,
      }))

      // Debug log: show incoming params and returned count
      try {
        console.log('[api/customers] params:', { page: url.searchParams.get('page'), limit: url.searchParams.get('limit'), sortBy, sortDir, q: url.searchParams.get('q'), status: url.searchParams.get('status') })
        console.log('[api/customers] rows returned:', rows.length)
      } catch (e) {
        console.debug('[api/customers] debug log failed', e)
      }

      // Also return total count for pagination
      const countResult = await client.query('SELECT COUNT(*)::int as count FROM customers')
      const total = countResult.rows[0].count || 0

      return NextResponse.json({ customers: rows, total })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to fetch customers:', error)
    return NextResponse.json({ customers: [], total: 0 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      company_name,
      contact_first_name,
      contact_last_name,
      contact_email,
      contact_phone,
      billing_address,
      billing_city,
      billing_state,
      billing_zip_code,
      billing_country = 'ID',
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_zip_code,
      shipping_country = 'ID',
      credit_limit = 0,
      current_balance = 0,
      payment_terms = 'Net 30',
      tax_id,
      is_active = true,
    } = body

    // Validate required fields
    if (!company_name) {
      return NextResponse.json(
        { error: "company_name is required" },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    try {
      // Generate customer number - find the highest number from all formats
      const customerNumberResult = await client.query(
        `SELECT COALESCE(
          MAX(
            CASE 
              WHEN customer_number ~ '^CUST-[0-9]+$' 
              THEN CAST(SUBSTRING(customer_number FROM 6) AS INTEGER)
              ELSE 0 
            END
          ), 0) + 1 as next_num
         FROM customers`
      )
      const nextNum = customerNumberResult.rows[0].next_num
      const customerNumber = `CUST-${nextNum.toString().padStart(6, '0')}`

      const result = await client.query(
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
          shipping_address,
          shipping_city,
          shipping_state,
          shipping_zip_code,
          shipping_country,
          credit_limit,
          current_balance,
          payment_terms,
          tax_id,
          is_active,
          created_at,
          updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, NOW(), NOW()
        ) RETURNING *`,
        [
          customerNumber,
          company_name,
          contact_first_name || null,
          contact_last_name || null,
          contact_email || null,
          contact_phone || null,
          billing_address || null,
          billing_city || null,
          billing_state || null,
          billing_zip_code || null,
          billing_country,
          shipping_address || null,
          shipping_city || null,
          shipping_state || null,
          shipping_zip_code || null,
          shipping_country,
          parseFloat(credit_limit),
          parseFloat(current_balance),
          payment_terms,
          tax_id || null,
          is_active,
        ]
      )
      
      return NextResponse.json({ 
        message: 'Customer created', 
        customer: result.rows[0] 
      }, { status: 201 })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to create customer:', error)
    return NextResponse.json({ 
      error: 'Failed to create customer',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
