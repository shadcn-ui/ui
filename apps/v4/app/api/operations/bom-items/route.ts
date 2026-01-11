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

// GET - Fetch all BOM items for a specific BOM
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bomId = searchParams.get('bomId')

    if (!bomId) {
      return NextResponse.json({ error: 'BOM ID is required' }, { status: 400 })
    }

    const result = await client.query(
      `SELECT * FROM bom_items 
       WHERE bom_id = $1 
       ORDER BY created_at ASC`,
      [bomId]
    )
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching BOM items:', error)
    return NextResponse.json({ error: 'Failed to fetch BOM items' }, { status: 500 })
  }
}

// POST - Create new BOM item
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { bom_id, component_name, component_code, quantity, unit, unit_cost, notes } = body

    const result = await client.query(
      `INSERT INTO bom_items 
       (bom_id, component_name, component_code, quantity, unit, unit_cost, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [bom_id, component_name, component_code || null, quantity || 1, unit || 'pcs', unit_cost || 0, notes || null]
    )

    // Update total cost in bill_of_materials
    await client.query(
      `UPDATE bill_of_materials 
       SET total_cost = (
         SELECT COALESCE(SUM(total_cost), 0) 
         FROM bom_items 
         WHERE bom_id = $1
       )
       WHERE id = $1`,
      [bom_id]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating BOM item:', error)
    return NextResponse.json({ error: 'Failed to create BOM item' }, { status: 500 })
  }
}

// PATCH - Update BOM item
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, bom_id, component_name, component_code, quantity, unit, unit_cost, notes } = body

    const result = await client.query(
      `UPDATE bom_items 
       SET component_name = $1, 
           component_code = $2, 
           quantity = $3, 
           unit = $4, 
           unit_cost = $5,
           notes = $6
       WHERE id = $7 
       RETURNING *`,
      [component_name, component_code, quantity, unit, unit_cost, notes, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'BOM item not found' }, { status: 404 })
    }

    // Update total cost in bill_of_materials
    await client.query(
      `UPDATE bill_of_materials 
       SET total_cost = (
         SELECT COALESCE(SUM(total_cost), 0) 
         FROM bom_items 
         WHERE bom_id = $1
       )
       WHERE id = $1`,
      [bom_id]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating BOM item:', error)
    return NextResponse.json({ error: 'Failed to update BOM item' }, { status: 500 })
  }
}

// DELETE - Delete BOM item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const bomId = searchParams.get('bomId')

    if (!id || !bomId) {
      return NextResponse.json({ error: 'Item ID and BOM ID are required' }, { status: 400 })
    }

    const result = await client.query(
      'DELETE FROM bom_items WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'BOM item not found' }, { status: 404 })
    }

    // Update total cost in bill_of_materials
    await client.query(
      `UPDATE bill_of_materials 
       SET total_cost = (
         SELECT COALESCE(SUM(total_cost), 0) 
         FROM bom_items 
         WHERE bom_id = $1
       )
       WHERE id = $1`,
      [bomId]
    )

    return NextResponse.json({ message: 'BOM item deleted successfully' })
  } catch (error) {
    console.error('Error deleting BOM item:', error)
    return NextResponse.json({ error: 'Failed to delete BOM item' }, { status: 500 })
  }
}
