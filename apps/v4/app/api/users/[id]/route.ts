import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// GET - Fetch single user by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = await pool.connect()
    
    try {
      const result = await client.query(
        `SELECT 
          u.id,
          u.first_name,
          u.last_name,
          u.first_name || ' ' || u.last_name as full_name,
          u.email,
          u.role,
          u.is_active,
          u.created_at,
          u.updated_at,
          COUNT(l.id) as total_leads,
          COUNT(l.id) FILTER (WHERE ls.name IN ('New', 'Contacted', 'Qualified')) as active_leads
        FROM users u
        LEFT JOIN leads l ON u.id = l.assigned_to
        LEFT JOIN lead_statuses ls ON l.status_id = ls.id
        WHERE u.id = $1
        GROUP BY u.id, u.first_name, u.last_name, u.email, u.role, u.is_active, u.created_at, u.updated_at`,
        [id]
      )

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0]
      })
      
    } finally {
      client.release()
    }

  } catch (error: any) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user', details: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update user by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { firstName, lastName, email, role, isActive } = body

    // Validation
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { success: false, error: 'First name, last name, and email are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    
    try {
      // Check if user exists
      const userCheck = await client.query('SELECT id FROM users WHERE id = $1', [id])
      if (userCheck.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        )
      }

      // Check if email is taken by another user
      const emailCheck = await client.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, id]
      )
      
      if (emailCheck.rows.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Email already exists' },
          { status: 409 }
        )
      }

      // Update user
      const result = await client.query(
        `UPDATE users SET
          first_name = $1,
          last_name = $2,
          email = $3,
          role = $4,
          is_active = $5,
          updated_at = NOW()
        WHERE id = $6
        RETURNING 
          id,
          first_name,
          last_name,
          first_name || ' ' || last_name as full_name,
          email,
          role,
          is_active,
          created_at,
          updated_at`,
        [
          firstName.trim(),
          lastName.trim(),
          email.toLowerCase().trim(),
          role || null,
          isActive !== undefined ? isActive : true,
          id
        ]
      )

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: 'User updated successfully'
      })
      
    } finally {
      client.release()
    }

  } catch (error: any) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Soft delete user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = await pool.connect()
    
    try {
      // Check if user exists
      const userCheck = await client.query('SELECT id, email FROM users WHERE id = $1', [id])
      if (userCheck.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        )
      }

      // Check if user has active leads
      const leadsCheck = await client.query(
        `SELECT COUNT(*) as count FROM leads l
         JOIN lead_statuses ls ON l.status_id = ls.id
         WHERE l.assigned_to = $1 
         AND ls.name IN ('New', 'Contacted', 'Qualified')`,
        [id]
      )

      const activeLeads = parseInt(leadsCheck.rows[0].count)

      // Soft delete - set is_active to false
      await client.query(
        'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1',
        [id]
      )

      return NextResponse.json({
        success: true,
        message: 'User deactivated successfully',
        warning: activeLeads > 0 ? `User has ${activeLeads} active leads that may need reassignment` : null
      })
      
    } finally {
      client.release()
    }

  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete user', details: error.message },
      { status: 500 }
    )
  }
}
