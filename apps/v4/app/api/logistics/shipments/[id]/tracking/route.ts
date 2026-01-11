import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// GET /api/logistics/shipments/[id]/tracking - Get tracking history
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // Verify shipment exists
    const shipmentCheck = await pool.query(
      'SELECT id, shipment_number, tracking_number, status FROM shipments WHERE id = $1',
      [id]
    );
    
    if (shipmentCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }
    
    const shipment = shipmentCheck.rows[0];
    
    // Get all tracking events
    const result = await pool.query(
      `SELECT 
        ste.*,
        u.email as created_by_email
      FROM shipment_tracking_events ste
      LEFT JOIN users u ON ste.created_by = u.id
      WHERE ste.shipment_id = $1
      ORDER BY ste.event_timestamp DESC`,
      [id]
    );
    
    return NextResponse.json({
      shipment: {
        id: shipment.id,
        shipment_number: shipment.shipment_number,
        tracking_number: shipment.tracking_number,
        status: shipment.status
      },
      tracking_events: result.rows,
      total_events: result.rows.length
    });
    
  } catch (error: any) {
    console.error('Error fetching tracking events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracking events', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/logistics/shipments/[id]/tracking - Add tracking event
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const {
      event_type,
      event_status = 'info',
      event_description,
      event_location,
      latitude,
      longitude,
      event_timestamp,
      carrier_event_data,
      is_customer_visible = true,
      notes,
      created_by,
      update_shipment_status = true
    } = body;
    
    // Validation
    if (!event_type || !event_description) {
      return NextResponse.json(
        { error: 'event_type and event_description are required' },
        { status: 400 }
      );
    }
    
    // Verify shipment exists
    const shipmentCheck = await client.query(
      'SELECT id, shipment_number, status FROM shipments WHERE id = $1',
      [id]
    );
    
    if (shipmentCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }
    
    await client.query('BEGIN');
    
    // Insert tracking event
    const result = await client.query(
      `INSERT INTO shipment_tracking_events (
        shipment_id, event_type, event_status, event_description,
        event_location, latitude, longitude, event_timestamp,
        carrier_event_data, is_customer_visible, notes, created_by, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP)
      RETURNING *`,
      [
        id, event_type, event_status, event_description,
        event_location, latitude, longitude, 
        event_timestamp || new Date().toISOString(),
        carrier_event_data ? JSON.stringify(carrier_event_data) : null,
        is_customer_visible, notes, created_by
      ]
    );
    
    const trackingEvent = result.rows[0];
    
    // Optionally update shipment status based on event type
    if (update_shipment_status) {
      const statusMap: Record<string, string> = {
        'picked': 'picked',
        'packed': 'packed',
        'manifested': 'manifested',
        'shipped': 'in_transit',
        'in_transit': 'in_transit',
        'out_for_delivery': 'out_for_delivery',
        'delivered': 'delivered',
        'exception': 'in_transit', // Keep as in_transit but flag issue
        'delayed': 'in_transit',
        'returned': 'returned',
        'cancelled': 'cancelled'
      };
      
      const newStatus = statusMap[event_type];
      if (newStatus) {
        await client.query(
          'UPDATE shipments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [newStatus, id]
        );
        
        // If delivered, set actual delivery date
        if (newStatus === 'delivered') {
          await client.query(
            'UPDATE shipments SET actual_delivery_date = $1 WHERE id = $2',
            [event_timestamp || new Date().toISOString().split('T')[0], id]
          );
        }
      }
    }
    
    await client.query('COMMIT');
    
    return NextResponse.json({
      message: 'Tracking event added successfully',
      tracking_event: trackingEvent
    }, { status: 201 });
    
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error adding tracking event:', error);
    return NextResponse.json(
      { error: 'Failed to add tracking event', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
