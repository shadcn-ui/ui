import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  user: 'mac',
  password: '',
  host: 'localhost',
  port: 5432,
  database: 'ocean_erp',
})

export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect()
    
    try {
      // Get total leads count
      const totalResult = await client.query('SELECT COUNT(*) as total FROM leads')
      
      // Get new leads count (created in last 7 days)
      const newResult = await client.query(`
        SELECT COUNT(*) as new_leads 
        FROM leads 
        WHERE created_at >= NOW() - INTERVAL '7 days'
      `)
      
      // Get qualified leads count
      const qualifiedResult = await client.query(`
        SELECT COUNT(*) as qualified 
        FROM leads l
        LEFT JOIN lead_statuses ls ON l.status_id = ls.id
        WHERE ls.name IN ('Qualified', 'Proposal', 'Negotiation')
      `)
      
      // Get hot leads count (using same criteria as hot leads page)
      const hotLeadsResult = await client.query(`
        WITH lead_scores AS (
          SELECT 
            l.*,
            ls.name as source_name,
            lst.name as status_name,
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
            ) as hot_score
            
          FROM leads l
          LEFT JOIN lead_sources ls ON l.source_id = ls.id
          LEFT JOIN lead_statuses lst ON l.status_id = lst.id
          WHERE l.id IS NOT NULL
        )
        SELECT COUNT(*) as hot_leads
        FROM lead_scores
        WHERE hot_score >= 50
      `)
      
      // Calculate conversion rate
      const wonResult = await client.query(`
        SELECT COUNT(*) as won 
        FROM leads l
        LEFT JOIN lead_statuses ls ON l.status_id = ls.id
        WHERE ls.name = 'Won'
      `)

      const totalLeads = parseInt(totalResult.rows[0].total)
      const wonLeads = parseInt(wonResult.rows[0].won)
      const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0.0'

      const summary = {
        totalLeads: totalLeads,
        newLeads: parseInt(newResult.rows[0].new_leads),
        qualifiedLeads: parseInt(qualifiedResult.rows[0].qualified),
        hotLeads: parseInt(hotLeadsResult.rows[0].hot_leads),
        conversionRate: parseFloat(conversionRate)
      }

      return NextResponse.json(summary)

    } catch (error: any) {
      console.error('Database error in summary:', error)
      return NextResponse.json(
        { error: 'Failed to fetch lead summary' },
        { status: 500 }
      )
    } finally {
      client.release()
    }

  } catch (error: any) {
    console.error('Error in summary API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}