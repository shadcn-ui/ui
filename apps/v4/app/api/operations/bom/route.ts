import { NextResponse } from 'next/server'
import { Client } from 'pg'

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'ocean-erp',
  user: process.env.DB_USER || 'mac',
  password: process.env.DB_PASSWORD || '',
})

client.connect().catch((err) => console.error('Database connection error:', err))

// GET - Fetch all BOMs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const product_code = searchParams.get('product_code')
    
    let query = `
      SELECT 
        b.*,
        COUNT(bi.id) as item_count,
        COALESCE(SUM(bi.total_cost), 0) as calculated_total_cost
      FROM bill_of_materials b
      LEFT JOIN bom_items bi ON b.id = bi.bom_id
    `
    
    const params: any[] = []
    if (product_code) {
      query += ` WHERE b.product_code = $1`
      params.push(product_code)
    }
    
    query += `
      GROUP BY b.id
      ORDER BY b.created_at DESC
    `
    
    const result = await client.query(query, params)
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching BOMs:', error)
    return NextResponse.json({ error: 'Failed to fetch BOMs' }, { status: 500 })
  }
}

// POST - Create new BOM
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { product_name, product_code, version, status, notes } = body

    const result = await client.query(
      `INSERT INTO bill_of_materials 
       (product_name, product_code, version, status, notes, total_cost) 
       VALUES ($1, $2, $3, $4, $5, 0) 
       RETURNING *`,
      [product_name, product_code || null, version || '1.0', status || 'active', notes || null]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating BOM:', error)
    return NextResponse.json({ error: 'Failed to create BOM' }, { status: 500 })
  }
}

// PATCH - Update BOM
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, product_name, product_code, version, status, notes, total_cost } = body

    const result = await client.query(
      `UPDATE bill_of_materials 
       SET product_name = $1, 
           product_code = $2, 
           version = $3, 
           status = $4, 
           notes = $5,
           total_cost = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 
       RETURNING *`,
      [product_name, product_code, version, status, notes, total_cost || 0, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'BOM not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating BOM:', error)
    return NextResponse.json({ error: 'Failed to update BOM' }, { status: 500 })
  }
}

// DELETE - Delete BOM
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'BOM ID is required' }, { status: 400 })
    }

    const result = await client.query(
      'DELETE FROM bill_of_materials WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'BOM not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'BOM deleted successfully' })
  } catch (error) {
    console.error('Error deleting BOM:', error)
    return NextResponse.json({ error: 'Failed to delete BOM' }, { status: 500 })
  }
}
