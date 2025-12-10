import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect()
    
    try {
      // Get sales team members with their lead assignments count
      const query = `
        SELECT 
          u.id,
          u.first_name as "firstName",
          u.last_name as "lastName", 
          u.email,
          u.role,
          COALESCE(u.role, 'Sales Representative') as department,
          CASE WHEN u.is_active IS NULL THEN true ELSE u.is_active END as "isActive",
          COALESCE(u.created_at, NOW()) as "joinDate",
          COUNT(l.id) as "leadsAssigned"
        FROM users u
        LEFT JOIN leads l ON l.assigned_to = u.id
        WHERE u.role IN ('Sales Representative', 'Account Manager', 'Sales Manager', 'Business Development', 'Sales Director')
           OR u.role IS NULL
        GROUP BY u.id, u.first_name, u.last_name, u.email, u.role, u.is_active, u.created_at
        ORDER BY u.first_name, u.last_name
      `
      
      const result = await client.query(query)
      
      const members = result.rows.map(row => ({
        ...row,
        leadsAssigned: parseInt(row.leadsAssigned || 0),
        joinDate: row.joinDate.toISOString(),
      }))

      return NextResponse.json({ members })
      
    } finally {
      client.release()
    }
    
  } catch (error: any) {
    console.error('Sales team API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales team members' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, role, isActive } = body

    const client = await pool.connect()
    
    try {
      // Check if user already exists
      const existingUserQuery = 'SELECT id FROM users WHERE email = $1'
      const existingUser = await client.query(existingUserQuery, [email])
      
      if (existingUser.rows.length > 0) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        )
      }

      // Insert new team member
      const insertQuery = `
        INSERT INTO users (first_name, last_name, email, role, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING id, first_name as "firstName", last_name as "lastName", email, role, is_active as "isActive"
      `
      
      const result = await client.query(insertQuery, [
        firstName,
        lastName, 
        email,
        role || 'Sales Representative',
        isActive !== false
      ])

      const newMember = {
        ...result.rows[0],
        department: role || 'Sales Representative',
        joinDate: new Date().toISOString(),
        leadsAssigned: 0
      }

      return NextResponse.json({ member: newMember }, { status: 201 })
      
    } finally {
      client.release()
    }
    
  } catch (error: any) {
    console.error('Sales team creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    )
  }
}