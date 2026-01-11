import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const client = await pool.connect()
    
    try {
      // Fetch sales team members for opportunity assignment (same as leads)
      const usersResult = await client.query(`
        SELECT 
          u.id,
          u.first_name,
          u.last_name,
          u.first_name || ' ' || u.last_name as full_name,
          u.email,
          u.role
        FROM users u
        WHERE (u.is_active IS NULL OR u.is_active = true)
          AND (u.role IN ('Sales Representative', 'Account Manager', 'Sales Manager', 'Business Development', 'Sales Director')
               OR u.role IS NULL)
        ORDER BY u.first_name, u.last_name
      `)

      return NextResponse.json({
        success: true,
        data: {
          users: usersResult.rows
        }
      })
      
    } finally {
      client.release()
    }

  } catch (error) {
    console.error('Error fetching opportunity lookup data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lookup data' },
      { status: 500 }
    )
  }
}