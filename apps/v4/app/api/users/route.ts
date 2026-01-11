import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// GET - Fetch all users
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const client = await pool.connect()
    
    try {
      let query = `
        SELECT 
          u.id,
          u.first_name,
          u.last_name,
          u.first_name || ' ' || u.last_name as full_name,
          u.email,
          u.role,
          u.is_active,
          u.created_at,
          u.updated_at,
          COUNT(DISTINCT l.id) as total_leads,
          STRING_AGG(DISTINCT r.display_name, ', ' ORDER BY r.display_name) as roles,
          COUNT(DISTINCT ur.role_id) as role_count
        FROM users u
        LEFT JOIN leads l ON u.id = l.assigned_to
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE 1=1
      `
      
      const params: any[] = []
      
      // Filter by active status
      if (!includeInactive) {
        query += ` AND (u.is_active IS NULL OR u.is_active = true)`
      }
      
      // Search filter
      if (search) {
        params.push(`%${search}%`)
        query += ` AND (
          u.first_name ILIKE $${params.length} OR 
          u.last_name ILIKE $${params.length} OR 
          u.email ILIKE $${params.length} OR
          r.display_name ILIKE $${params.length}
        )`
      }
      
      query += `
        GROUP BY u.id, u.first_name, u.last_name, u.email, u.role, u.is_active, u.created_at, u.updated_at
        ORDER BY u.created_at DESC
      `
      
      const result = await client.query(query, params)
      
      // Get statistics - count users with administrator role
      const statsQuery = `
        SELECT 
          COUNT(DISTINCT u.id) as total_users,
          COUNT(DISTINCT u.id) FILTER (WHERE u.is_active = true OR u.is_active IS NULL) as active_users,
          COUNT(DISTINCT u.id) FILTER (WHERE u.is_active = false) as inactive_users,
          COUNT(DISTINCT u.id) FILTER (WHERE r.name = 'administrator') as admin_users
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
      `
      const statsResult = await client.query(statsQuery)
      
      return NextResponse.json({
        success: true,
        data: {
          users: result.rows,
          stats: statsResult.rows[0]
        }
      })
      
    } finally {
      client.release()
    }

  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new user
export async function POST(request: Request) {
  try {
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
      // Check if email already exists
      const checkEmail = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      )
      
      if (checkEmail.rows.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Email already exists' },
          { status: 409 }
        )
      }

      // Generate temporary password
      const tempPassword = crypto.randomBytes(8).toString('hex')
      const hashedPassword = await bcrypt.hash(tempPassword, 10)

      // Insert new user
      const result = await client.query(
        `INSERT INTO users (
          first_name, 
          last_name, 
          email,
          password_hash, 
          role, 
          is_active,
          email_verified,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
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
          hashedPassword,
          role || null,
          isActive !== undefined ? isActive : true,
          true // Email verified since admin is creating
        ]
      )

      // In production, you would send an email with the temporary password
      // For now, we'll return it in the response (ONLY for development!)
      console.log(`Temporary password for ${email}: ${tempPassword}`)

      return NextResponse.json({
        success: true,
        data: {
          ...result.rows[0],
          tempPassword // Remove this in production!
        },
        message: 'User created successfully. Temporary password has been generated.'
      }, { status: 201 })
      
    } finally {
      client.release()
    }

  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create user', details: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update user
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, firstName, lastName, email, role, isActive } = body

    // Validation
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

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
          isActive,
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

// DELETE - Soft delete user (set is_active = false)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

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

      // Soft delete - set is_active to false
      await client.query(
        'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1',
        [id]
      )

      return NextResponse.json({
        success: true,
        message: 'User deactivated successfully'
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
