#!/usr/bin/env node

// Simple script to test PostgreSQL connection
import { Client } from 'pg'

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'ocean-erp',
  user: 'mac',
  password: '',
})

async function testConnection() {
  try {
    await client.connect()
    console.log('✅ Connected to PostgreSQL database successfully!')
    
    // Test query
    const result = await client.query('SELECT COUNT(*) as lead_count FROM leads')
    console.log(`📊 Found ${result.rows[0].lead_count} leads in the database`)
    
    // Test lead sources
    const sources = await client.query('SELECT name FROM lead_sources ORDER BY name')
    console.log(`📋 Available lead sources: ${sources.rows.map(r => r.name).join(', ')}`)
    
    // Test lead statuses
    const statuses = await client.query('SELECT name FROM lead_statuses ORDER BY sort_order')
    console.log(`🎯 Available lead statuses: ${statuses.rows.map(r => r.name).join(', ')}`)
    
    console.log('🎉 Database connection test completed successfully!')
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

testConnection()