import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// GET /api/logistics/carriers - List all carriers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const is_active = searchParams.get('is_active');
    const carrier_type = searchParams.get('carrier_type');
    const service_level = searchParams.get('service_level');
    const min_rating = searchParams.get('min_rating');
    
    let query = `
      SELECT 
        c.*,
        COUNT(DISTINCT s.id) as total_shipments,
        AVG(CASE 
          WHEN s.actual_delivery_date IS NOT NULL 
          AND s.estimated_delivery_date IS NOT NULL 
          THEN 
            CASE 
              WHEN s.actual_delivery_date <= s.estimated_delivery_date THEN 100 
              ELSE 0 
            END
        END) as on_time_percentage,
        AVG(COALESCE(s.total_shipping_cost, s.total_cost)) as avg_shipping_cost
      FROM carriers c
      LEFT JOIN shipments s ON c.id = s.carrier_id 
        AND s.status IN ('delivered', 'Delivered')
        AND s.actual_delivery_date >= CURRENT_DATE - INTERVAL '90 days'
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCount = 0;
    
    if (is_active !== null) {
      paramCount++;
      query += ` AND c.is_active = $${paramCount}`;
      params.push(is_active === 'true');
    }
    
    if (carrier_type) {
      paramCount++;
      query += ` AND c.carrier_type = $${paramCount}`;
      params.push(carrier_type);
    }
    
    if (service_level) {
      paramCount++;
      query += ` AND c.service_level = $${paramCount}`;
      params.push(service_level);
    }
    
    if (min_rating) {
      paramCount++;
      query += ` AND c.rating >= $${paramCount}`;
      params.push(parseFloat(min_rating));
    }
    
    query += `
      GROUP BY c.id
      ORDER BY c.rating DESC, c.carrier_name ASC
    `;
    
    const result = await pool.query(query, params);
    
    return NextResponse.json({
      carriers: result.rows,
      total: result.rows.length
    });
    
  } catch (error: any) {
    console.error('Error fetching carriers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch carriers', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/logistics/carriers - Create new carrier
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      carrier_code,
      carrier_name,
      carrier_type,
      service_level,
      contact_name,
      contact_email,
      contact_phone,
      api_endpoint,
      api_key_encrypted,
      tracking_url_template,
      supports_label_generation = false,
      supports_tracking = true,
      supports_pickup = false,
      is_active = true,
      rating = 0.00,
      notes,
      created_by
    } = body;
    
    // Validation
    if (!carrier_code || !carrier_name || !carrier_type) {
      return NextResponse.json(
        { error: 'carrier_code, carrier_name, and carrier_type are required' },
        { status: 400 }
      );
    }
    
    // Check for duplicate carrier code
    const checkResult = await pool.query(
      'SELECT id FROM carriers WHERE carrier_code = $1',
      [carrier_code]
    );
    
    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'Carrier code already exists' },
        { status: 409 }
      );
    }
    
    const result = await pool.query(
      `INSERT INTO carriers (
        carrier_code, carrier_name, carrier_type, service_level,
        contact_name, contact_email, contact_phone,
        api_endpoint, api_key_encrypted, tracking_url_template,
        supports_label_generation, supports_tracking, supports_pickup,
        is_active, rating, notes, created_at, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, CURRENT_TIMESTAMP, $17)
      RETURNING *`,
      [
        carrier_code, carrier_name, carrier_type, service_level,
        contact_name, contact_email, contact_phone,
        api_endpoint, api_key_encrypted, tracking_url_template,
        supports_label_generation, supports_tracking, supports_pickup,
        is_active, rating, notes, created_by
      ]
    );
    
    return NextResponse.json({
      message: 'Carrier created successfully',
      carrier: result.rows[0]
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating carrier:', error);
    return NextResponse.json(
      { error: 'Failed to create carrier', details: error.message },
      { status: 500 }
    );
  }
}
