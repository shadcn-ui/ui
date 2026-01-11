import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// GET - Fetch all skincare formulations
export async function GET(request: NextRequest) {
  const client = await pool.connect()
  
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const status = searchParams.get('status')
    const formulation_type = searchParams.get('formulation_type')
    const regulatory_status = searchParams.get('regulatory_status')
    
    let query = `
      SELECT 
        sf.*,
        COUNT(si.id) as item_count,
        COALESCE(SUM(si.total_cost), 0) as total_cost,
        COALESCE(AVG(
          CASE 
            WHEN si.safety_rating = 'A' THEN 3
            WHEN si.safety_rating = 'B' THEN 2
            WHEN si.safety_rating = 'C' THEN 1
            ELSE 2
          END
        ), 2) as avg_safety_score
      FROM skincare_formulations sf
      LEFT JOIN skincare_ingredients si ON sf.id = si.formulation_id
    `
    
    const conditions = []
    const params = []
    let paramCount = 0
    
    if (id) {
      paramCount++
      conditions.push(`sf.id = $${paramCount}`)
      params.push(id)
    }
    
    if (status) {
      paramCount++
      conditions.push(`sf.status = $${paramCount}`)
      params.push(status)
    }
    
    if (formulation_type) {
      paramCount++
      conditions.push(`sf.formulation_type = $${paramCount}`)
      params.push(formulation_type)
    }
    
    if (regulatory_status) {
      paramCount++
      conditions.push(`sf.regulatory_status = $${paramCount}`)
      params.push(regulatory_status)
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`
    }
    
    query += `
      GROUP BY sf.id
      ORDER BY sf.updated_at DESC
    `
    
    const result = await client.query(query, params)
    
    // Calculate safety rating based on average score
    const formulationsWithSafety = result.rows.map(row => ({
      ...row,
      safety_rating: row.avg_safety_score >= 2.5 ? 'A' : row.avg_safety_score >= 1.5 ? 'B' : 'C'
    }))
    
    if (id && formulationsWithSafety.length > 0) {
      // Return single formulation with details
      return NextResponse.json(formulationsWithSafety[0])
    }
    
    return NextResponse.json(formulationsWithSafety)
    
  } catch (error) {
    console.error('Error fetching skincare formulations:', error)
    return NextResponse.json({ error: 'Failed to fetch formulations' }, { status: 500 })
  } finally {
    client.release()
  }
}

// POST - Create new skincare formulation
export async function POST(request: NextRequest) {
  const client = await pool.connect()
  
  try {
    const body = await request.json()
    const {
      product_name,
      product_code,
      version,
      status,
      formulation_type,
      skin_type_target,
      ph_level,
      preservation_system,
      regulatory_status,
      shelf_life_months,
      batch_size,
      notes
    } = body
    
    // Generate product code if not provided
    const finalProductCode = product_code || `SKC-${Date.now().toString().slice(-6)}`
    
    const query = `
      INSERT INTO skincare_formulations (
        product_name,
        product_code,
        version,
        status,
        formulation_type,
        skin_type_target,
        ph_level,
        preservation_system,
        regulatory_status,
        shelf_life_months,
        batch_size,
        notes,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
      RETURNING *
    `
    
    const params = [
      product_name,
      finalProductCode,
      version || '1.0',
      status || 'draft',
      formulation_type,
      Array.isArray(skin_type_target) ? skin_type_target : [],
      ph_level || 5.5,
      preservation_system,
      regulatory_status || 'pending',
      shelf_life_months || 24,
      batch_size || 1000,
      notes
    ]
    
    const result = await client.query(query, params)
    
    return NextResponse.json(result.rows[0], { status: 201 })
    
  } catch (error) {
    console.error('Error creating skincare formulation:', error)
    return NextResponse.json({ error: 'Failed to create formulation' }, { status: 500 })
  } finally {
    client.release()
  }
}

// PATCH - Update existing skincare formulation
export async function PATCH(request: NextRequest) {
  const client = await pool.connect()
  
  try {
    const body = await request.json()
    const { id, ...updateFields } = body
    
    if (!id) {
      return NextResponse.json({ error: 'Formulation ID is required' }, { status: 400 })
    }
    
    const setClause: string[] = []
    const params: any[] = []
    let paramCount = 0
    
    Object.entries(updateFields).forEach(([key, value]) => {
      paramCount++
      setClause.push(`${key} = $${paramCount}`)
      params.push(value)
    })
    
    if (setClause.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }
    
    paramCount++
    params.push(id)
    
    const query = `
      UPDATE skincare_formulations 
      SET ${setClause.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING *
    `
    
    const result = await client.query(query, params)
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Formulation not found' }, { status: 404 })
    }
    
    return NextResponse.json(result.rows[0])
    
  } catch (error) {
    console.error('Error updating skincare formulation:', error)
    return NextResponse.json({ error: 'Failed to update formulation' }, { status: 500 })
  } finally {
    client.release()
  }
}

// DELETE - Delete skincare formulation
export async function DELETE(request: NextRequest) {
  const client = await pool.connect()
  
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Formulation ID is required' }, { status: 400 })
    }
    
    await client.query('BEGIN')
    
    // Delete all ingredients first
    await client.query('DELETE FROM skincare_ingredients WHERE formulation_id = $1', [id])
    
    // Delete the formulation
    const result = await client.query('DELETE FROM skincare_formulations WHERE id = $1 RETURNING *', [id])
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK')
      return NextResponse.json({ error: 'Formulation not found' }, { status: 404 })
    }
    
    await client.query('COMMIT')
    
    return NextResponse.json({ message: 'Formulation deleted successfully' })
    
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error deleting skincare formulation:', error)
    return NextResponse.json({ error: 'Failed to delete formulation' }, { status: 500 })
  } finally {
    client.release()
  }
}