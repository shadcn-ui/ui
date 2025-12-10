import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, role, isActive } = body
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)

    const client = await pool.connect()
    
    try {
      // Check if user exists
      const existingQuery = 'SELECT id FROM users WHERE id = $1'
      const existing = await client.query(existingQuery, [id])
      
      if (existing.rows.length === 0) {
        return NextResponse.json(
          { error: 'Team member not found' },
          { status: 404 }
        )
      }

      // Check if email is taken by another user
      const emailCheckQuery = 'SELECT id FROM users WHERE email = $1 AND id != $2'
      const emailCheck = await client.query(emailCheckQuery, [email, id])
      
      if (emailCheck.rows.length > 0) {
        return NextResponse.json(
          { error: 'Email is already in use by another user' },
          { status: 400 }
        )
      }

      // Update team member
      const updateQuery = `
        UPDATE users 
        SET first_name = $1, last_name = $2, email = $3, role = $4, is_active = $5, updated_at = NOW()
        WHERE id = $6
        RETURNING id, first_name as "firstName", last_name as "lastName", email, role, is_active as "isActive"
      `
      
      const result = await client.query(updateQuery, [
        firstName,
        lastName,
        email,
        role,
        isActive !== false,
        id
      ])

      return NextResponse.json({ member: result.rows[0] })
      
    } finally {
      client.release()
    }
    
  } catch (error: any) {
    console.error('Sales team update error:', error)
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    const client = await pool.connect()
    
    try {
      // Check if user has assigned leads
      const leadsCheckQuery = 'SELECT COUNT(*) as count FROM leads WHERE assigned_to = $1'
      const leadsCheck = await client.query(leadsCheckQuery, [id])
      const leadsCount = parseInt(leadsCheck.rows[0].count)
      
      if (leadsCount > 0) {
        // Don't delete, just deactivate
        const deactivateQuery = `
          UPDATE users 
          SET is_active = false, updated_at = NOW()
          WHERE id = $1
          RETURNING id
        `
        
        const result = await client.query(deactivateQuery, [id])
        
        if (result.rows.length === 0) {
          return NextResponse.json(
            { error: 'Team member not found' },
            { status: 404 }
          )
        }

        return NextResponse.json({ 
          message: `Team member deactivated (has ${leadsCount} assigned leads)`,
          deactivated: true 
        })
      } else {
        // Safe to delete
        const deleteQuery = 'DELETE FROM users WHERE id = $1 RETURNING id'
        const result = await client.query(deleteQuery, [id])
        
        if (result.rows.length === 0) {
          return NextResponse.json(
            { error: 'Team member not found' },
            { status: 404 }
          )
        }

        return NextResponse.json({ 
          message: 'Team member deleted successfully',
          deleted: true 
        })
      }
      
    } finally {
      client.release()
    }
    
  } catch (error: any) {
    console.error('Sales team deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    )
  }
}