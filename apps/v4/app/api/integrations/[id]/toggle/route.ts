import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { enabled } = await request.json()
    const { id: integrationId } = await params

    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      // Check if integration exists
      const checkQuery = `
        SELECT id FROM integrations WHERE integration_id = $1
      `
      const checkResult = await client.query(checkQuery, [integrationId])

      if (checkResult.rows.length === 0) {
        // Create new integration record
        const insertQuery = `
          INSERT INTO integrations (integration_id, name, status, enabled, created_at, updated_at)
          VALUES ($1, $2, $3, $4, NOW(), NOW())
          RETURNING id
        `
        await client.query(insertQuery, [
          integrationId,
          integrationId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          enabled ? 'active' : 'inactive',
          enabled
        ])
      } else {
        // Update existing integration
        const updateQuery = `
          UPDATE integrations
          SET enabled = $1, status = $2, updated_at = NOW()
          WHERE integration_id = $3
        `
        await client.query(updateQuery, [
          enabled,
          enabled ? 'active' : 'inactive',
          integrationId
        ])
      }

      await client.query('COMMIT')

      return NextResponse.json({
        success: true,
        message: `Integration ${enabled ? 'enabled' : 'disabled'} successfully`
      })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error toggling integration:', error)
    return NextResponse.json(
      { error: 'Failed to toggle integration' },
      { status: 500 }
    )
  }
}
