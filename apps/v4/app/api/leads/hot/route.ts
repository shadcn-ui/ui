import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  user: 'mac',
  password: '',
  host: 'localhost',
  port: 5432,
  database: 'ocean-erp',
})

interface HotLead {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  company: string
  job_title: string
  estimated_value: number
  source_name: string
  status_name: string
  status_color: string
  assigned_name: string
  created_at: string
  last_activity: string
  hot_score: number
  priority_reason: string
}

export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect()
    
    try {
      // Query for hot leads based on multiple criteria
      const hotLeadsQuery = `
        WITH lead_scores AS (
          SELECT 
            l.*,
            ls.name as source_name,
            lst.name as status_name,
            lst.color as status_color,
            u.first_name || ' ' || u.last_name as assigned_name,
            
            -- Calculate hot score based on multiple factors
            (
              -- High estimated value (30 points max)
              CASE 
                WHEN l.estimated_value >= 100000 THEN 30
                WHEN l.estimated_value >= 50000 THEN 20
                WHEN l.estimated_value >= 25000 THEN 15
                WHEN l.estimated_value >= 10000 THEN 10
                ELSE 5
              END +
              
              -- Recent creation or activity (25 points max)
              CASE 
                WHEN l.created_at >= NOW() - INTERVAL '1 day' THEN 25
                WHEN l.created_at >= NOW() - INTERVAL '3 days' THEN 20
                WHEN l.created_at >= NOW() - INTERVAL '7 days' THEN 15
                WHEN l.created_at >= NOW() - INTERVAL '14 days' THEN 10
                ELSE 0
              END +
              
              -- Lead status priority (20 points max)
              CASE 
                WHEN lst.name IN ('Qualified', 'Proposal', 'Negotiation') THEN 20
                WHEN lst.name IN ('Contacted') THEN 15
                WHEN lst.name IN ('New') THEN 10
                ELSE 5
              END +
              
              -- Source quality (15 points max)
              CASE 
                WHEN ls.name IN ('Referral', 'Website') THEN 15
                WHEN ls.name IN ('Email Campaign', 'Trade Show') THEN 12
                WHEN ls.name IN ('Social Media', 'Partner') THEN 10
                ELSE 8
              END +
              
              -- Job title seniority (10 points max)
              CASE 
                WHEN l.job_title ILIKE '%CEO%' OR l.job_title ILIKE '%President%' OR l.job_title ILIKE '%Founder%' THEN 10
                WHEN l.job_title ILIKE '%CTO%' OR l.job_title ILIKE '%CIO%' OR l.job_title ILIKE '%VP%' OR l.job_title ILIKE '%Director%' THEN 8
                WHEN l.job_title ILIKE '%Manager%' OR l.job_title ILIKE '%Lead%' THEN 6
                ELSE 4
              END
            ) as hot_score,
            
            -- Generate priority reason
            CASE 
              WHEN l.estimated_value >= 100000 AND l.created_at >= NOW() - INTERVAL '3 days' THEN 'High value recent lead'
              WHEN lst.name IN ('Qualified', 'Proposal') THEN 'Advanced stage lead'
              WHEN l.created_at >= NOW() - INTERVAL '1 day' THEN 'New lead requiring follow-up'
              WHEN l.estimated_value >= 50000 THEN 'High value opportunity'
              WHEN ls.name = 'Referral' THEN 'Referral lead - high conversion'
              WHEN l.job_title ILIKE '%CEO%' OR l.job_title ILIKE '%President%' THEN 'C-level decision maker'
              WHEN l.created_at <= NOW() - INTERVAL '7 days' AND lst.name = 'New' THEN 'Stale lead needs attention'
              ELSE 'Follow-up required'
            END as priority_reason,
            
            -- Last activity (for now, use created_at as placeholder)
            l.created_at as last_activity
            
          FROM leads l
          LEFT JOIN lead_sources ls ON l.source_id = ls.id
          LEFT JOIN lead_statuses lst ON l.status_id = lst.id
          LEFT JOIN users u ON l.assigned_to = u.id
          WHERE l.id IS NOT NULL
        )
        SELECT *
        FROM lead_scores
        WHERE hot_score >= 50  -- Only show leads with score 50 or higher
        ORDER BY hot_score DESC, estimated_value DESC NULLS LAST
        LIMIT 50
      `

      const result = await client.query(hotLeadsQuery)
      
      const hotLeads: HotLead[] = result.rows.map(row => ({
        id: row.id,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        phone: row.phone || '',
        company: row.company || '',
        job_title: row.job_title || '',
        estimated_value: parseFloat(row.estimated_value) || 0,
        source_name: row.source_name || '',
        status_name: row.status_name || '',
        status_color: row.status_color || '#6b7280',
        assigned_name: row.assigned_name || '',
        created_at: row.created_at,
        last_activity: row.last_activity,
        hot_score: parseInt(row.hot_score) || 0,
        priority_reason: row.priority_reason || ''
      }))

      return NextResponse.json(hotLeads)

    } catch (error: any) {
      console.error('Database error in hot leads:', error)
      return NextResponse.json(
        { error: 'Failed to fetch hot leads' },
        { status: 500 }
      )
    } finally {
      client.release()
    }

  } catch (error: any) {
    console.error('Error in hot leads API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}