import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.DB_USER || 'mac',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ocean-erp',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
})

export async function GET() {
  try {
    const client = await pool.connect()
    try {
      const result = await client.query('SELECT * FROM company_settings ORDER BY id DESC LIMIT 1')
      
      if (result.rows.length === 0) {
        // Return default settings if none exist
        return NextResponse.json({
          settings: {
            company_name: 'Ocean ERP',
            address: 'Your Company Address',
            city: 'City, Province 12345',
            phone: '+62 xxx xxxx xxxx',
            email: 'info@oceanerp.com',
            logo_url: null,
            website: null,
            tax_id: null
          }
        })
      }
      
      return NextResponse.json({ settings: result.rows[0] })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching company settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { company_name, address, city, phone, email, logo_url, website, tax_id } = body

    const client = await pool.connect()
    try {
      // Check if settings exist
      const existing = await client.query('SELECT id FROM company_settings LIMIT 1')
      
      let result
      if (existing.rows.length > 0) {
        // Update existing settings
        result = await client.query(
          `UPDATE company_settings 
           SET company_name = $1, address = $2, city = $3, phone = $4, 
               email = $5, logo_url = $6, website = $7, tax_id = $8, 
               updated_at = NOW() 
           WHERE id = $9
           RETURNING *`,
          [company_name, address, city, phone, email, logo_url, website, tax_id, existing.rows[0].id]
        )
      } else {
        // Insert new settings
        result = await client.query(
          `INSERT INTO company_settings 
           (company_name, address, city, phone, email, logo_url, website, tax_id) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
           RETURNING *`,
          [company_name, address, city, phone, email, logo_url, website, tax_id]
        )
      }
      
      return NextResponse.json({ settings: result.rows[0] })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error saving company settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
