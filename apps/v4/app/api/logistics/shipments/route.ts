import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// GET /api/logistics/shipments - List all shipments with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    
    // Filters
    const status = searchParams.get('status');
    const carrier_id = searchParams.get('carrier_id');
    const priority = searchParams.get('priority');
    const shipment_type = searchParams.get('shipment_type');
    const from_date = searchParams.get('from_date');
    const to_date = searchParams.get('to_date');
    const search = searchParams.get('search'); // Search by number, tracking, customer name
    
    let query = `
      SELECT 
        s.*,
        c.carrier_name,
        c.carrier_type,
        lf.facility_name as origin_facility_name,
        dz.zone_name as delivery_zone_name,
        (SELECT COUNT(*) FROM shipment_items si WHERE si.shipment_id = s.id) as item_count,
        (SELECT COUNT(*) FROM shipment_packages sp WHERE sp.shipment_id = s.id) as package_count_actual,
        (SELECT event_description 
         FROM shipment_tracking_events 
         WHERE shipment_id = s.id 
         ORDER BY event_timestamp DESC 
         LIMIT 1) as latest_event,
        (SELECT event_timestamp 
         FROM shipment_tracking_events 
         WHERE shipment_id = s.id 
         ORDER BY event_timestamp DESC 
         LIMIT 1) as latest_event_time
      FROM shipments s
      LEFT JOIN carriers c ON s.carrier_id = c.id
      LEFT JOIN logistics_facilities lf ON s.origin_facility_id = lf.id
      LEFT JOIN delivery_zones dz ON s.delivery_zone_id = dz.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCount = 0;
    
    if (status) {
      paramCount++;
      query += ` AND s.status = $${paramCount}`;
      params.push(status);
    }
    
    if (carrier_id) {
      paramCount++;
      query += ` AND s.carrier_id = $${paramCount}`;
      params.push(parseInt(carrier_id));
    }
    
    if (priority) {
      paramCount++;
      query += ` AND s.priority = $${paramCount}`;
      params.push(priority);
    }
    
    if (shipment_type) {
      paramCount++;
      query += ` AND s.shipment_type = $${paramCount}`;
      params.push(shipment_type);
    }
    
    if (from_date) {
      paramCount++;
      query += ` AND COALESCE(s.planned_ship_date, s.shipment_date) >= $${paramCount}`;
      params.push(from_date);
    }
    
    if (to_date) {
      paramCount++;
      query += ` AND COALESCE(s.planned_ship_date, s.shipment_date) <= $${paramCount}`;
      params.push(to_date);
    }
    
    if (search) {
      paramCount++;
      query += ` AND (
        s.shipment_number ILIKE $${paramCount} OR 
        s.tracking_number ILIKE $${paramCount} OR 
        s.customer_name ILIKE $${paramCount}
      )`;
      params.push(`%${search}%`);
    }
    
    // Count total
    const countQuery = query.replace(/SELECT[\s\S]*FROM/, 'SELECT COUNT(*) FROM');
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);
    
    // Add pagination
    query += ` ORDER BY COALESCE(s.planned_ship_date, s.shipment_date, s.created_at) DESC`;
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(limit);
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);
    
    const result = await pool.query(query, params);
    
    return NextResponse.json({
      shipments: result.rows,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching shipments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipments', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/logistics/shipments - Create new shipment
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    
    const {
      shipment_type = 'sales_order',
      source_id,
      source_type,
      origin_facility_id,
      destination_type = 'customer',
      destination_id,
      destination_name,
      destination_address_line1,
      destination_address_line2,
      destination_city,
      destination_state,
      destination_postal_code,
      destination_country = 'USA',
      destination_latitude,
      destination_longitude,
      contact_name,
      contact_phone,
      contact_email,
      delivery_instructions,
      carrier_id,
      service_type = 'standard',
      planned_ship_date,
      requested_delivery_date,
      delivery_time_slot,
      priority = 'normal',
      requires_signature = false,
      requires_appointment = false,
      is_cod = false,
      cod_amount,
      is_hazardous = false,
      temperature_controlled = false,
      temperature_range,
      items = [], // Array of shipment items
      notes,
      created_by
    } = body;
    
    // Validation
    if (!destination_name || !destination_address_line1 || !destination_city || !destination_postal_code) {
      return NextResponse.json(
        { error: 'Missing required destination fields' },
        { status: 400 }
      );
    }
    
    await client.query('BEGIN');
    
    // Generate shipment number
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const countResult = await client.query(
      `SELECT COUNT(*) FROM shipments WHERE shipment_number LIKE $1`,
      [`SHP-${dateStr}-%`]
    );
    const sequence = parseInt(countResult.rows[0].count) + 1;
    const shipment_number = `SHP-${dateStr}-${sequence.toString().padStart(4, '0')}`;
    
    // Determine delivery zone (if not provided, try to match by postal code)
    let delivery_zone_id = body.delivery_zone_id;
    if (!delivery_zone_id && destination_postal_code) {
      const zoneResult = await client.query(
        `SELECT id FROM delivery_zones 
         WHERE country_code = $1 
         AND (
           postal_code_pattern IS NULL 
           OR $2 ~ postal_code_pattern
         )
         LIMIT 1`,
        [destination_country, destination_postal_code]
      );
      if (zoneResult.rows.length > 0) {
        delivery_zone_id = zoneResult.rows[0].id;
      }
    }
    
    // Calculate estimated delivery date based on SLA
    let estimated_delivery_date = requested_delivery_date;
    if (!estimated_delivery_date && delivery_zone_id) {
      const slaResult = await client.query(
        'SELECT delivery_sla_hours FROM delivery_zones WHERE id = $1',
        [delivery_zone_id]
      );
      if (slaResult.rows.length > 0) {
        const sla_hours = slaResult.rows[0].delivery_sla_hours || 48;
        const ship_date = planned_ship_date ? new Date(planned_ship_date) : new Date();
        estimated_delivery_date = new Date(ship_date.getTime() + sla_hours * 60 * 60 * 1000)
          .toISOString().split('T')[0];
      }
    }
    
    // Insert shipment
    const shipmentResult = await client.query(
      `INSERT INTO shipments (
        shipment_number, shipment_type, source_id, source_type,
        origin_facility_id, destination_type, destination_id,
        customer_name, destination_address, 
        destination_city, destination_state, destination_postal_code, destination_country,
        destination_latitude, destination_longitude, delivery_zone_id,
        contact_name, contact_phone, contact_email, delivery_instructions,
        carrier_id, service_type, 
        planned_ship_date, estimated_delivery_date, requested_delivery_date, delivery_time_slot,
        status, priority, requires_signature, requires_appointment,
        is_cod, cod_amount, is_hazardous, temperature_controlled, temperature_range,
        notes, created_at, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        $31, $32, $33, $34, $35, $36, CURRENT_TIMESTAMP, $37
      )
      RETURNING *`,
      [
        shipment_number, shipment_type, source_id, source_type,
        origin_facility_id, destination_type, destination_id,
        destination_name, destination_address_line1 + (destination_address_line2 ? '\n' + destination_address_line2 : ''),
        destination_city, destination_state, destination_postal_code, destination_country,
        destination_latitude, destination_longitude, delivery_zone_id,
        contact_name, contact_phone, contact_email, delivery_instructions,
        carrier_id, service_type,
        planned_ship_date, estimated_delivery_date, requested_delivery_date, delivery_time_slot,
        'draft', priority, requires_signature, requires_appointment,
        is_cod, cod_amount, is_hazardous, temperature_controlled, temperature_range,
        notes, created_by
      ]
    );
    
    const shipment = shipmentResult.rows[0];
    
    // Insert shipment items
    if (items && items.length > 0) {
      for (const item of items) {
        await client.query(
          `INSERT INTO shipment_items (
            shipment_id, source_line_id, product_id, sku, product_name,
            quantity_ordered, quantity_shipped, uom, weight_kg, volume_m3,
            lot_number, serial_numbers, expiry_date, notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
          [
            shipment.id, item.source_line_id, item.product_id, item.sku, item.product_name,
            item.quantity_ordered, item.quantity_shipped, item.uom,
            item.weight_kg, item.volume_m3, item.lot_number,
            item.serial_numbers, item.expiry_date, item.notes
          ]
        );
      }
    }
    
    // Create initial tracking event
    await client.query(
      `INSERT INTO shipment_tracking_events (
        shipment_id, event_type, event_status, event_description, event_timestamp, created_by
      ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5)`,
      [
        shipment.id, 'created', 'info',
        `Shipment ${shipment_number} created`,
        created_by
      ]
    );
    
    await client.query('COMMIT');
    
    // Fetch complete shipment with items
    const completeShipment = await pool.query(
      `SELECT s.*, 
        (SELECT json_agg(si.*) FROM shipment_items si WHERE si.shipment_id = s.id) as items
       FROM shipments s
       WHERE s.id = $1`,
      [shipment.id]
    );
    
    return NextResponse.json({
      message: 'Shipment created successfully',
      shipment: completeShipment.rows[0]
    }, { status: 201 });
    
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating shipment:', error);
    return NextResponse.json(
      { error: 'Failed to create shipment', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
