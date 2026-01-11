import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.DB_USER || 'mac',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ocean-erp',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
})

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = parseInt(resolvedParams.id)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  try {
    const client = await pool.connect()
    try {
      const result = await client.query(`
        SELECT 
          o.*,
          o.assigned_to as assigned_to_name
        FROM opportunities o
        WHERE o.id = $1
      `, [id])
      
      if (result.rowCount === 0) return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
      
      const opportunity = result.rows[0]
      // assigned_to is already the name, just ensure it's not null
      opportunity.assigned_to = opportunity.assigned_to_name || ''
      delete opportunity.assigned_to_name
      
      return NextResponse.json({ opportunity })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('GET opportunity error', error)
    return NextResponse.json({ error: 'Failed to fetch opportunity' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = parseInt(resolvedParams.id)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  try {
    const body = await request.json()
    console.log('PATCH opportunity request body:', body)
    
    const client = await pool.connect()
    
    try {
      const fields: string[] = []
      const values: any[] = []
      let idx = 1

      // Handle assigned_to field - store the name directly
      let assignedToValue = null
      if (body.assigned_to !== undefined) {
        assignedToValue = body.assigned_to === 'unassigned' ? null : body.assigned_to
      }

      const allowed = ['title','company','contact','email','phone','stage','value','probability','expected_close_date','source','description','notes']
      for (const key of Object.keys(body)) {
        if (allowed.includes(key)) {
          // Validate numeric fields
          if (key === 'value' && (isNaN(body[key]) || body[key] === null)) {
            return NextResponse.json({ error: 'Invalid value: must be a valid number' }, { status: 400 })
          }
          if (key === 'probability' && body[key] !== null && (isNaN(body[key]) || body[key] < 0 || body[key] > 100)) {
            return NextResponse.json({ error: 'Invalid probability: must be between 0 and 100' }, { status: 400 })
          }
          fields.push(`${key} = $${idx}`)
          values.push(body[key])
          idx++
        }
      }

      // Add assigned_to separately after processing
      if (body.assigned_to !== undefined) {
        fields.push(`assigned_to = $${idx}`)
        values.push(assignedToValue)
        idx++
      }

      if (fields.length === 0) {
        return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
      }

      values.push(id)
      const query = `UPDATE opportunities SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`

      console.log('Executing query:', query, 'with values:', values)
      
      const result = await client.query(query, values)
      if (result.rowCount === 0) return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
      
      console.log('Update successful')
      return NextResponse.json({ message: 'Opportunity updated', opportunity: result.rows[0] })
      
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('PATCH opportunity error', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update opportunity'
    return NextResponse.json({ error: 'Failed to update opportunity', details: errorMessage }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = parseInt(resolvedParams.id)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  try {
    const client = await pool.connect()
    try {
      const result = await client.query('DELETE FROM opportunities WHERE id = $1 RETURNING *', [id])
      if (result.rowCount === 0) return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
      return NextResponse.json({ message: 'Opportunity deleted', opportunity: result.rows[0] })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('DELETE opportunity error', error)
    return NextResponse.json({ error: 'Failed to delete opportunity' }, { status: 500 })
  }
}
