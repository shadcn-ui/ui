import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// GET - Fetch ingredients for a formulation
export async function GET(request: NextRequest) {
  const client = await pool.connect()
  
  try {
    const { searchParams } = new URL(request.url)
    const formulation_id = searchParams.get('formulationId')
    const id = searchParams.get('id')
    
    if (!formulation_id && !id) {
      return NextResponse.json({ error: 'Formulation ID or ingredient ID is required' }, { status: 400 })
    }
    
    let query = `
      SELECT 
        si.*,
        s.company_name as supplier_company_name
      FROM skincare_ingredients si
      LEFT JOIN suppliers s ON si.supplier_name = s.company_name
    `
    
    const params: any[] = []
    let paramCount = 0
    
    if (id) {
      paramCount++
      query += ` WHERE si.id = $${paramCount}`
      params.push(id)
    } else if (formulation_id) {
      paramCount++
      query += ` WHERE si.formulation_id = $${paramCount}`
      params.push(formulation_id)
    }
    
    query += ` ORDER BY si.percentage DESC, si.ingredient_name ASC`
    
    const result = await client.query(query, params)
    
    if (id && result.rows.length > 0) {
      return NextResponse.json(result.rows[0])
    }
    
    return NextResponse.json(result.rows)
    
  } catch (error) {
    console.error('Error fetching skincare ingredients:', error)
    return NextResponse.json({ error: 'Failed to fetch ingredients' }, { status: 500 })
  } finally {
    client.release()
  }
}

// POST - Add new ingredient to formulation
export async function POST(request: NextRequest) {
  const client = await pool.connect()
  
  try {
    const body = await request.json()
    const {
      formulation_id,
      ingredient_name,
      inci_name,
      cas_number,
      function_type,
      percentage,
      quantity_grams,
      unit_cost,
      supplier_name,
      safety_rating,
      allergenic_potential,
      pregnancy_safe,
      halal_certified,
      vegan_approved,
      organic_certified,
      notes
    } = body
    
    if (!formulation_id) {
      return NextResponse.json({ error: 'Formulation ID is required' }, { status: 400 })
    }
    
    // Get formulation batch size to calculate quantities
    const formulationResult = await client.query(
      'SELECT batch_size FROM skincare_formulations WHERE id = $1',
      [formulation_id]
    )
    
    if (formulationResult.rows.length === 0) {
      return NextResponse.json({ error: 'Formulation not found' }, { status: 404 })
    }
    
    const batchSize = formulationResult.rows[0].batch_size || 1000
    const calculatedQuantity = quantity_grams || (batchSize * percentage / 100)
    const totalCost = calculatedQuantity * (unit_cost || 0)
    
    const query = `
      INSERT INTO skincare_ingredients (
        formulation_id,
        ingredient_name,
        inci_name,
        cas_number,
        function_type,
        percentage,
        quantity_grams,
        unit_cost,
        total_cost,
        supplier_name,
        safety_rating,
        allergenic_potential,
        pregnancy_safe,
        halal_certified,
        vegan_approved,
        organic_certified,
        notes,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW())
      RETURNING *
    `
    
    const params = [
      formulation_id,
      ingredient_name,
      inci_name,
      cas_number,
      function_type,
      percentage || 0,
      calculatedQuantity,
      unit_cost || 0,
      totalCost,
      supplier_name,
      safety_rating || 'B',
      allergenic_potential || false,
      pregnancy_safe || true,
      halal_certified || false,
      vegan_approved || false,
      organic_certified || false,
      notes
    ]
    
    const result = await client.query(query, params)
    
    // Update formulation total cost
    const updateFormulationQuery = `
      UPDATE skincare_formulations 
      SET total_cost = (
        SELECT COALESCE(SUM(total_cost), 0) 
        FROM skincare_ingredients 
        WHERE formulation_id = $1
      ),
      updated_at = NOW()
      WHERE id = $1
    `
    
    await client.query(updateFormulationQuery, [formulation_id])
    
    return NextResponse.json(result.rows[0], { status: 201 })
    
  } catch (error) {
    console.error('Error adding skincare ingredient:', error)
    return NextResponse.json({ error: 'Failed to add ingredient' }, { status: 500 })
  } finally {
    client.release()
  }
}

// PATCH - Update existing ingredient
export async function PATCH(request: NextRequest) {
  const client = await pool.connect()
  
  try {
    const body = await request.json()
    const { id, formulation_id, ...updateFields } = body
    
    if (!id) {
      return NextResponse.json({ error: 'Ingredient ID is required' }, { status: 400 })
    }
    
    // Recalculate total cost if quantity or unit_cost changed
    if (updateFields.quantity_grams || updateFields.unit_cost || updateFields.percentage) {
      const currentResult = await client.query('SELECT * FROM skincare_ingredients WHERE id = $1', [id])
      if (currentResult.rows.length > 0) {
        const current = currentResult.rows[0]
        const newQuantity = updateFields.quantity_grams || current.quantity_grams
        const newUnitCost = updateFields.unit_cost || current.unit_cost
        updateFields.total_cost = newQuantity * newUnitCost
      }
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
      UPDATE skincare_ingredients 
      SET ${setClause.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING *
    `
    
    const result = await client.query(query, params)
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Ingredient not found' }, { status: 404 })
    }
    
    // Update formulation total cost
    const ingredient = result.rows[0]
    const updateFormulationQuery = `
      UPDATE skincare_formulations 
      SET total_cost = (
        SELECT COALESCE(SUM(total_cost), 0) 
        FROM skincare_ingredients 
        WHERE formulation_id = $1
      ),
      updated_at = NOW()
      WHERE id = $1
    `
    
    await client.query(updateFormulationQuery, [ingredient.formulation_id])
    
    return NextResponse.json(result.rows[0])
    
  } catch (error) {
    console.error('Error updating skincare ingredient:', error)
    return NextResponse.json({ error: 'Failed to update ingredient' }, { status: 500 })
  } finally {
    client.release()
  }
}

// DELETE - Remove ingredient from formulation
export async function DELETE(request: NextRequest) {
  const client = await pool.connect()
  
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Ingredient ID is required' }, { status: 400 })
    }
    
    // Get formulation_id before deletion for cost update
    const ingredientResult = await client.query('SELECT formulation_id FROM skincare_ingredients WHERE id = $1', [id])
    
    if (ingredientResult.rows.length === 0) {
      return NextResponse.json({ error: 'Ingredient not found' }, { status: 404 })
    }
    
    const formulation_id = ingredientResult.rows[0].formulation_id
    
    // Delete the ingredient
    await client.query('DELETE FROM skincare_ingredients WHERE id = $1', [id])
    
    // Update formulation total cost
    const updateFormulationQuery = `
      UPDATE skincare_formulations 
      SET total_cost = (
        SELECT COALESCE(SUM(total_cost), 0) 
        FROM skincare_ingredients 
        WHERE formulation_id = $1
      ),
      updated_at = NOW()
      WHERE id = $1
    `
    
    await client.query(updateFormulationQuery, [formulation_id])
    
    return NextResponse.json({ message: 'Ingredient removed successfully' })
    
  } catch (error) {
    console.error('Error removing skincare ingredient:', error)
    return NextResponse.json({ error: 'Failed to remove ingredient' }, { status: 500 })
  } finally {
    client.release()
  }
}