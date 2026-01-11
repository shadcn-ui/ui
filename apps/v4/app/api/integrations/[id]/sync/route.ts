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
    const { id: integrationId } = await params
    const client = await pool.connect()

    try {
      // Record sync activity
      const syncQuery = `
        INSERT INTO integration_logs (integration_id, action, status, details, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING id
      `
      
      await client.query(syncQuery, [
        integrationId,
        'sync',
        'success',
        JSON.stringify({ triggered_by: 'manual', timestamp: new Date() })
      ])

      // Update last sync time
      const updateQuery = `
        UPDATE integrations
        SET last_sync_at = NOW(), sync_count = COALESCE(sync_count, 0) + 1
        WHERE integration_id = $1
      `
      await client.query(updateQuery, [integrationId])

      // In a real implementation, this would trigger actual sync logic based on integration type
      // For now, we just record the sync event

      return NextResponse.json({
        success: true,
        message: 'Sync initiated successfully',
        syncedAt: new Date()
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error syncing integration:', error)
    return NextResponse.json(
      { error: 'Failed to sync integration' },
      { status: 500 }
    )
  }
}
