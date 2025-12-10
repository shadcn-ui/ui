import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect()
    
    try {
      // Get active sales team members for dropdowns
      const query = `
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
      `
      
      const result = await client.query(query)

      return NextResponse.json({ 
        success: true,
        data: result.rows
      })
      
    } finally {
      client.release()
    }
    
  } catch (error: any) {
    console.error('Sales team lookup API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sales team lookup' },
      { status: 500 }
    )
  }
}