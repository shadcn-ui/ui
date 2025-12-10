import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const source = searchParams.get('source') || ''
    const status = searchParams.get('status') || ''
    const assignedTo = searchParams.get('assignedTo') || ''
    const days = parseInt(searchParams.get('days') || '30')
    
    const client = await pool.connect()
    
    try {
      // Calculate date range
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      
      // Build dynamic WHERE clause
      let whereConditions = ['l.created_at >= $1 AND l.created_at <= $2']
      let params: any[] = [startDate, endDate]
      let paramIndex = 3
      
      if (search) {
        whereConditions.push(`(
          LOWER(l.first_name) LIKE LOWER($${paramIndex}) OR 
          LOWER(l.last_name) LIKE LOWER($${paramIndex}) OR 
          LOWER(l.email) LIKE LOWER($${paramIndex}) OR 
          LOWER(l.company) LIKE LOWER($${paramIndex})
        )`)
        params.push(`%${search}%`)
        paramIndex++
      }
      
      if (source) {
        whereConditions.push(`src.name = $${paramIndex}`)
        params.push(source)
        paramIndex++
      }
      
      if (status) {
        whereConditions.push(`ls.name = $${paramIndex}`)
        params.push(status)
        paramIndex++
      }
      
      if (assignedTo) {
        whereConditions.push(`CONCAT(u.first_name, ' ', u.last_name) = $${paramIndex}`)
        params.push(assignedTo)
        paramIndex++
      }
      
      const whereClause = whereConditions.join(' AND ')
      
      const query = `
        SELECT 
          l.id,
          l.first_name as "firstName",
          l.last_name as "lastName",
          l.email,
          l.company,
          COALESCE(src.name, 'Unknown') as source,
          COALESCE(ls.name, 'Unknown') as status,
          COALESCE(l.estimated_value, 0) as "estimatedValue",
          COALESCE(CONCAT(u.first_name, ' ', u.last_name), 'Unassigned') as "assignedTo",
          l.created_at as "createdAt",
          l.updated_at as "lastActivity"
        FROM leads l
        LEFT JOIN lead_sources src ON l.source_id = src.id
        LEFT JOIN lead_statuses ls ON l.status_id = ls.id
        LEFT JOIN users u ON l.assigned_to = u.id
        WHERE ${whereClause}
        ORDER BY l.created_at DESC
        LIMIT 1000
      `
      
      const result = await client.query(query, params)
      
      const leads = result.rows.map(row => ({
        ...row,
        estimatedValue: parseFloat(row.estimatedValue || 0),
        createdAt: row.createdAt.toISOString(),
        lastActivity: row.lastActivity.toISOString()
      }))

      return NextResponse.json({ leads })
      
    } finally {
      client.release()
    }
    
  } catch (error: any) {
    console.error('Detailed reports API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch detailed reports data' },
      { status: 500 }
    )
  }
}