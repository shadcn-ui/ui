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
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'overview'

    const client = await pool.connect()
    try {
      let result

      switch (type) {
        case 'overview':
        case 'kpis':
          result = await client.query('SELECT * FROM sales_kpis')
          return NextResponse.json({ kpis: result.rows[0] || {} })

        case 'daily':
          const days = parseInt(searchParams.get('days') || '30')
          result = await client.query(
            `SELECT * FROM sales_daily_summary 
             WHERE date >= CURRENT_DATE - INTERVAL '${days} days'
             ORDER BY date DESC`
          )
          return NextResponse.json({ data: result.rows })

        case 'monthly':
          result = await client.query('SELECT * FROM monthly_sales_trend')
          return NextResponse.json({ data: result.rows })

        case 'status':
          result = await client.query('SELECT * FROM sales_by_status')
          return NextResponse.json({ data: result.rows })

        case 'payment':
          result = await client.query('SELECT * FROM sales_by_payment_status')
          return NextResponse.json({ data: result.rows })

        case 'customers':
          const limit = parseInt(searchParams.get('limit') || '10')
          result = await client.query(
            `SELECT * FROM customer_performance 
             ORDER BY total_revenue DESC 
             LIMIT ${limit}`
          )
          return NextResponse.json({ data: result.rows })

        case 'top-customers':
          result = await client.query('SELECT * FROM top_customers_by_revenue')
          return NextResponse.json({ data: result.rows })

        case 'products':
          result = await client.query('SELECT * FROM top_products')
          return NextResponse.json({ data: result.rows })

        case 'funnel':
          result = await client.query('SELECT * FROM lead_conversion_funnel')
          return NextResponse.json({ data: result.rows })

        case 'pipeline':
          result = await client.query('SELECT * FROM opportunity_pipeline')
          return NextResponse.json({ data: result.rows })

        default:
          return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
      }
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
