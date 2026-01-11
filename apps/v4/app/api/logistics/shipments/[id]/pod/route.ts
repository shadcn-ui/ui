import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// POST /api/logistics/shipments/[id]/pod - Record Proof of Delivery
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const {
      delivered_by,
      received_by,
      signature_url,
      photo_url,
      notes,
      delivery_timestamp,
      items_delivered, // Optional: array of item IDs with quantities delivered
      updated_by
    } = body;
    
    // Validation
    if (!received_by) {
      return NextResponse.json(
        { error: 'received_by is required' },
        { status: 400 }
      );
    }
    
    // Verify shipment exists and is in deliverable status
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
    
    const shipment = shipmentCheck.rows[0];
    
    if (!['out_for_delivery', 'in_transit', 'In Transit'].includes(shipment.status)) {
      return NextResponse.json(
        { error: `Cannot record POD for shipment with status: ${shipment.status}` },
        { status: 400 }
      );
    }
    
    await client.query('BEGIN');
    
    // Update shipment with POD information
    const deliveryDate = delivery_timestamp 
      ? new Date(delivery_timestamp).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    
    await client.query(
      `UPDATE shipments 
       SET status = 'delivered',
           actual_delivery_date = $1,
           delivered_by = $2,
           received_by = $3,
           pod_signature_url = $4,
           pod_photo_url = $5,
           pod_notes = $6,
           updated_at = CURRENT_TIMESTAMP,
           updated_by = $7
       WHERE id = $8`,
      [
        deliveryDate,
        delivered_by,
        received_by,
        signature_url,
        photo_url,
        notes,
        updated_by,
        id
      ]
    );
    
    // Update shipment items with delivered quantities
    if (items_delivered && items_delivered.length > 0) {
      for (const item of items_delivered) {
        await client.query(
          `UPDATE shipment_items 
           SET quantity_delivered = $1
           WHERE id = $2 AND shipment_id = $3`,
          [item.quantity_delivered, item.item_id, id]
        );
      }
    } else {
      // If no specific items provided, mark all as delivered with shipped quantity
      await client.query(
        `UPDATE shipment_items 
         SET quantity_delivered = quantity_shipped
         WHERE shipment_id = $1`,
        [id]
      );
    }
    
    // Create delivery tracking event
    await client.query(
      `INSERT INTO shipment_tracking_events (
        shipment_id, event_type, event_status, event_description, 
        event_location, event_timestamp, is_customer_visible, created_by, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`,
      [
        id,
        'delivered',
        'success',
        `Shipment ${shipment.shipment_number} delivered. Received by: ${received_by}`,
        null, // Could extract from shipment destination
        delivery_timestamp || new Date().toISOString(),
        true,
        updated_by
      ]
    );
    
    await client.query('COMMIT');
    
    // Fetch updated shipment
    const updatedShipment = await pool.query(
      `SELECT s.*, 
        (SELECT json_agg(si.*) FROM shipment_items si WHERE si.shipment_id = s.id) as items
       FROM shipments s
       WHERE s.id = $1`,
      [id]
    );
    
    return NextResponse.json({
      message: 'Proof of delivery recorded successfully',
      shipment: updatedShipment.rows[0]
    });
    
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error recording POD:', error);
    return NextResponse.json(
      { error: 'Failed to record proof of delivery', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// GET /api/logistics/shipments/[id]/pod - Get POD details
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    const result = await pool.query(
      `SELECT 
        s.id,
        s.shipment_number,
        s.status,
        s.actual_delivery_date,
        s.delivered_by,
        s.received_by,
        s.pod_signature_url,
        s.pod_photo_url,
        s.pod_notes,
        s.customer_name as destination_name,
        s.destination_address,
        s.destination_city,
        s.destination_state,
        (SELECT json_agg(
          json_build_object(
            'id', si.id,
            'product_name', si.product_name,
            'sku', si.sku,
            'quantity_ordered', si.quantity_ordered,
            'quantity_shipped', si.quantity_shipped,
            'quantity_delivered', si.quantity_delivered,
            'uom', si.uom
          )
        ) FROM shipment_items si WHERE si.shipment_id = s.id) as items,
        (SELECT event_timestamp 
         FROM shipment_tracking_events 
         WHERE shipment_id = s.id AND event_type = 'delivered'
         ORDER BY event_timestamp DESC 
         LIMIT 1) as delivery_timestamp
      FROM shipments s
      WHERE s.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }
    
    const shipment = result.rows[0];
    
    if (shipment.status !== 'delivered' && shipment.status !== 'Delivered') {
      return NextResponse.json(
        { error: 'Shipment has not been delivered yet' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      pod: shipment
    });
    
  } catch (error: any) {
    console.error('Error fetching POD:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proof of delivery', details: error.message },
      { status: 500 }
    );
  }
}
