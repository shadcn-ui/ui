import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.DB_USER || 'mac',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ocean-erp',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'summary'
    const userId = searchParams.get('user_id')
    const periodType = searchParams.get('period') || 'monthly'

    const client = await pool.connect()
    try {
      let result

      switch (type) {
        case 'summary':
          // Overall performance summary
          if (userId) {
            result = await client.query(
              'SELECT * FROM user_performance_summary WHERE user_id = $1',
              [parseInt(userId)]
            )
          } else {
            result = await client.query('SELECT * FROM user_performance_summary')
          }
          return NextResponse.json({ data: result.rows })

        case 'current':
          // Current month performance
          if (userId) {
            result = await client.query(
              'SELECT * FROM current_month_performance WHERE user_id = $1',
              [parseInt(userId)]
            )
          } else {
            result = await client.query('SELECT * FROM current_month_performance')
          }
          return NextResponse.json({ data: result.rows })

        case 'leaderboard':
          // Top performers leaderboard
          result = await client.query('SELECT * FROM top_performers_leaderboard')
          return NextResponse.json({ data: result.rows })

        case 'goals':
          // Goal achievement status
          if (userId) {
            result = await client.query(
              'SELECT * FROM goal_achievement_status WHERE user_id = $1',
              [parseInt(userId)]
            )
          } else {
            result = await client.query('SELECT * FROM goal_achievement_status')
          }
          return NextResponse.json({ data: result.rows })

        case 'achievements':
          // User achievements
          const achievementsQuery = userId
            ? 'SELECT * FROM achievements WHERE user_id = $1 ORDER BY achieved_at DESC'
            : 'SELECT * FROM achievements ORDER BY achieved_at DESC LIMIT 50'
          result = await client.query(achievementsQuery, userId ? [parseInt(userId)] : [])
          return NextResponse.json({ data: result.rows })

        case 'period':
          // Performance for specific period
          if (!userId) {
            return NextResponse.json({ error: 'user_id required for period data' }, { status: 400 })
          }
          result = await client.query(
            `SELECT * FROM sales_performance 
             WHERE user_id = $1 AND period_type = $2
             ORDER BY period_start DESC`,
            [parseInt(userId), periodType]
          )
          return NextResponse.json({ data: result.rows })

        case 'team':
          // Team performance
          result = await client.query(
            `SELECT * FROM team_performance 
             WHERE period_type = $1
             ORDER BY period_start DESC`,
            [periodType]
          )
          return NextResponse.json({ data: result.rows })

        case 'trends':
          // Performance trends over time
          if (!userId) {
            return NextResponse.json({ error: 'user_id required for trends' }, { status: 400 })
          }
          result = await client.query(
            `SELECT 
              period_start,
              period_end,
              total_revenue,
              orders_created,
              conversion_rate,
              win_rate
             FROM sales_performance 
             WHERE user_id = $1 AND period_type = $2
             ORDER BY period_start ASC
             LIMIT 12`,
            [parseInt(userId), periodType]
          )
          return NextResponse.json({ data: result.rows })

        default:
          return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
      }
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to fetch performance metrics:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch performance metrics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type } = body

    const client = await pool.connect()
    try {
      if (type === 'goal') {
        // Create a new goal
        const {
          user_id,
          goal_type,
          period_type,
          period_start,
          period_end,
          target_value,
          description,
          created_by
        } = body

        const result = await client.query(
          `INSERT INTO performance_goals 
           (user_id, goal_type, period_type, period_start, period_end, target_value, description, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING *`,
          [user_id, goal_type, period_type, period_start, period_end, target_value, description, created_by]
        )

        return NextResponse.json({ 
          message: 'Goal created successfully',
          goal: result.rows[0]
        }, { status: 201 })

      } else if (type === 'achievement') {
        // Record an achievement
        const {
          user_id,
          achievement_type,
          title,
          description,
          badge_icon,
          achievement_value,
          achieved_at
        } = body

        const result = await client.query(
          `INSERT INTO achievements 
           (user_id, achievement_type, title, description, badge_icon, achievement_value, achieved_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
          [user_id, achievement_type, title, description, badge_icon, achievement_value, achieved_at || new Date()]
        )

        return NextResponse.json({ 
          message: 'Achievement recorded',
          achievement: result.rows[0]
        }, { status: 201 })

      } else if (type === 'performance') {
        // Record performance metrics
        const {
          user_id,
          period_type,
          period_start,
          period_end,
          leads_created,
          leads_qualified,
          opportunities_created,
          opportunities_won,
          opportunities_lost,
          quotations_sent,
          quotations_accepted,
          orders_created,
          orders_completed,
          total_revenue,
          total_orders_value,
          avg_deal_size,
          conversion_rate,
          win_rate,
          quotation_acceptance_rate,
          calls_made,
          emails_sent,
          meetings_held
        } = body

        const result = await client.query(
          `INSERT INTO sales_performance 
           (user_id, period_type, period_start, period_end, leads_created, leads_qualified,
            opportunities_created, opportunities_won, opportunities_lost, quotations_sent,
            quotations_accepted, orders_created, orders_completed, total_revenue,
            total_orders_value, avg_deal_size, conversion_rate, win_rate,
            quotation_acceptance_rate, calls_made, emails_sent, meetings_held)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
           ON CONFLICT (user_id, period_type, period_start)
           DO UPDATE SET
             leads_created = EXCLUDED.leads_created,
             leads_qualified = EXCLUDED.leads_qualified,
             opportunities_created = EXCLUDED.opportunities_created,
             opportunities_won = EXCLUDED.opportunities_won,
             opportunities_lost = EXCLUDED.opportunities_lost,
             quotations_sent = EXCLUDED.quotations_sent,
             quotations_accepted = EXCLUDED.quotations_accepted,
             orders_created = EXCLUDED.orders_created,
             orders_completed = EXCLUDED.orders_completed,
             total_revenue = EXCLUDED.total_revenue,
             total_orders_value = EXCLUDED.total_orders_value,
             avg_deal_size = EXCLUDED.avg_deal_size,
             conversion_rate = EXCLUDED.conversion_rate,
             win_rate = EXCLUDED.win_rate,
             quotation_acceptance_rate = EXCLUDED.quotation_acceptance_rate,
             calls_made = EXCLUDED.calls_made,
             emails_sent = EXCLUDED.emails_sent,
             meetings_held = EXCLUDED.meetings_held,
             updated_at = CURRENT_TIMESTAMP
           RETURNING *`,
          [
            user_id, period_type, period_start, period_end, leads_created || 0, leads_qualified || 0,
            opportunities_created || 0, opportunities_won || 0, opportunities_lost || 0,
            quotations_sent || 0, quotations_accepted || 0, orders_created || 0,
            orders_completed || 0, total_revenue || 0, total_orders_value || 0,
            avg_deal_size || 0, conversion_rate || 0, win_rate || 0,
            quotation_acceptance_rate || 0, calls_made || 0, emails_sent || 0, meetings_held || 0
          ]
        )

        return NextResponse.json({ 
          message: 'Performance metrics recorded',
          performance: result.rows[0]
        }, { status: 201 })
      }

      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to create performance data:', error)
    return NextResponse.json({ 
      error: 'Failed to create performance data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
