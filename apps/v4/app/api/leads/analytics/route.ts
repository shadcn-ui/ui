import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    
    const client = await pool.connect()
    
    try {
      // Calculate date range
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      
      // Get total leads in period
      const totalLeadsQuery = `
        SELECT COUNT(*) as total
        FROM leads 
        WHERE created_at >= $1 AND created_at <= $2
      `
      const totalLeadsResult = await client.query(totalLeadsQuery, [startDate, endDate])
      const totalLeads = parseInt(totalLeadsResult.rows[0].total)

      // Calculate conversion rate (qualified leads / total leads)
      const conversionQuery = `
        SELECT 
          COUNT(CASE WHEN ls.name = 'Qualified' THEN 1 END) as qualified_count,
          COUNT(*) as total_count
        FROM leads l
        JOIN lead_statuses ls ON l.status_id = ls.id
        WHERE l.created_at >= $1 AND l.created_at <= $2
      `
      const conversionResult = await client.query(conversionQuery, [startDate, endDate])
      const { qualified_count, total_count } = conversionResult.rows[0]
      const conversionRate = total_count > 0 ? (qualified_count / total_count) * 100 : 0

      // Calculate average lead value
      const avgValueQuery = `
        SELECT AVG(estimated_value) as avg_value
        FROM leads 
        WHERE created_at >= $1 AND created_at <= $2 AND estimated_value > 0
      `
      const avgValueResult = await client.query(avgValueQuery, [startDate, endDate])
      const averageValue = parseFloat(avgValueResult.rows[0].avg_value || 0)

      // Leads by source with conversion rates
      const sourceQuery = `
        SELECT 
          COALESCE(src.name, 'Unknown') as source,
          COUNT(*) as count,
          ROUND(
            (COUNT(CASE WHEN ls.name = 'Qualified' THEN 1 END) * 100.0 / COUNT(*)), 1
          ) as conversion_rate
        FROM leads l
        LEFT JOIN lead_sources src ON l.source_id = src.id
        LEFT JOIN lead_statuses ls ON l.status_id = ls.id
        WHERE l.created_at >= $1 AND l.created_at <= $2
        GROUP BY src.name
        ORDER BY count DESC
        LIMIT 10
      `
      const sourceResult = await client.query(sourceQuery, [startDate, endDate])
      const leadsBySource = sourceResult.rows.map(row => ({
        source: row.source,
        count: parseInt(row.count),
        conversionRate: parseFloat(row.conversion_rate || 0)
      }))

      // Leads by status
      const statusQuery = `
        SELECT 
          COALESCE(ls.name, 'Unknown') as status,
          COUNT(*) as count,
          ROUND((COUNT(*) * 100.0 / (
            SELECT COUNT(*) FROM leads 
            WHERE created_at >= $1 AND created_at <= $2
          )), 1) as percentage
        FROM leads l
        LEFT JOIN lead_statuses ls ON l.status_id = ls.id
        WHERE l.created_at >= $1 AND l.created_at <= $2
        GROUP BY ls.name
        ORDER BY count DESC
      `
      const statusResult = await client.query(statusQuery, [startDate, endDate])
      const leadsByStatus = statusResult.rows.map(row => ({
        status: row.status,
        count: parseInt(row.count),
        percentage: parseFloat(row.percentage || 0)
      }))

      // Monthly trends for the last 6 months
      const trendsQuery = `
        SELECT 
          TO_CHAR(DATE_TRUNC('month', l.created_at), 'Mon YYYY') as month,
          DATE_TRUNC('month', l.created_at) as month_date,
          COUNT(*) as leads,
          COUNT(CASE WHEN ls.name = 'Qualified' THEN 1 END) as conversions
        FROM leads l
        LEFT JOIN lead_statuses ls ON l.status_id = ls.id
        WHERE l.created_at >= $1 AND l.created_at <= $2
        GROUP BY DATE_TRUNC('month', l.created_at)
        ORDER BY month_date DESC
        LIMIT 6
      `
      const trendsResult = await client.query(trendsQuery, [startDate, endDate])
      const monthlyTrends = trendsResult.rows.map(row => ({
        month: row.month,
        leads: parseInt(row.leads),
        conversions: parseInt(row.conversions)
      })).reverse()

      // Top performers by assigned users
      const performersQuery = `
        SELECT 
          COALESCE(CONCAT(u.first_name, ' ', u.last_name), 'Unassigned') as assigned_to,
          COUNT(*) as leads_count,
          ROUND(
            (COUNT(CASE WHEN ls.name = 'Qualified' THEN 1 END) * 100.0 / COUNT(*)), 1
          ) as conversion_rate,
          COALESCE(SUM(l.estimated_value), 0) as total_value
        FROM leads l
        LEFT JOIN users u ON l.assigned_to = u.id
        LEFT JOIN lead_statuses ls ON l.status_id = ls.id
        WHERE l.created_at >= $1 AND l.created_at <= $2
        GROUP BY u.first_name, u.last_name, l.assigned_to
        HAVING COUNT(*) > 0
        ORDER BY leads_count DESC, conversion_rate DESC
        LIMIT 10
      `
      const performersResult = await client.query(performersQuery, [startDate, endDate])
      const topPerformers = performersResult.rows.map(row => ({
        assignedTo: row.assigned_to,
        leadsCount: parseInt(row.leads_count),
        conversionRate: parseFloat(row.conversion_rate || 0),
        totalValue: parseFloat(row.total_value || 0)
      }))

      const analytics = {
        totalLeads,
        conversionRate,
        averageValue,
        leadsBySource,
        leadsByStatus,
        monthlyTrends,
        topPerformers
      }

      return NextResponse.json(analytics)
      
    } finally {
      client.release()
    }
    
  } catch (error: any) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}