import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// GET /api/logistics/shipments/[id] - Get shipment by ID with full details
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    const result = await pool.query(
      `SELECT 
        s.*,
        c.carrier_name,
        c.carrier_code,
        c.tracking_url_template,
        lf.facility_name as origin_facility_name,
        lf.address_line1 as origin_address,
        lf.city as origin_city,
        lf.state_province as origin_state,
        dz.zone_name as delivery_zone_name,
        dz.delivery_sla_hours,
        (SELECT json_agg(
          json_build_object(
            'id', si.id,
            'product_id', si.product_id,
            'sku', si.sku,
            'product_name', si.product_name,
            'quantity_ordered', si.quantity_ordered,
            'quantity_shipped', si.quantity_shipped,
            'quantity_delivered', si.quantity_delivered,
            'uom', si.uom,
            'weight_kg', si.weight_kg,
            'volume_m3', si.volume_m3,
            'lot_number', si.lot_number,
            'serial_numbers', si.serial_numbers,
            'expiry_date', si.expiry_date,
            'notes', si.notes
          )
        ) FROM shipment_items si WHERE si.shipment_id = s.id) as items,
        (SELECT json_agg(
          json_build_object(
            'id', sp.id,
            'package_number', sp.package_number,
            'tracking_number', sp.tracking_number,
            'package_type', sp.package_type,
            'weight_kg', sp.weight_kg,
            'dimensions', json_build_object(
              'length_cm', sp.length_cm,
              'width_cm', sp.width_cm,
              'height_cm', sp.height_cm,
              'volume_m3', sp.volume_m3
            ),
            'label_url', sp.label_url,
            'barcode', sp.barcode
          )
        ) FROM shipment_packages sp WHERE sp.shipment_id = s.id) as packages,
        (SELECT json_agg(
          json_build_object(
            'id', ste.id,
            'event_type', ste.event_type,
            'event_status', ste.event_status,
            'event_description', ste.event_description,
            'event_location', ste.event_location,
            'latitude', ste.latitude,
            'longitude', ste.longitude,
            'event_timestamp', ste.event_timestamp,
            'is_customer_visible', ste.is_customer_visible
          ) ORDER BY ste.event_timestamp DESC
        ) FROM shipment_tracking_events ste WHERE ste.shipment_id = s.id) as tracking_events
      FROM shipments s
      LEFT JOIN carriers c ON s.carrier_id = c.id
      LEFT JOIN logistics_facilities lf ON s.origin_facility_id = lf.id
      LEFT JOIN delivery_zones dz ON s.delivery_zone_id = dz.id
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
    
    // Calculate additional metrics
    const totalWeight = shipment.items?.reduce(
      (sum: number, item: any) => sum + (parseFloat(item.weight_kg) || 0),
      0
    ) || 0;
    
    const totalVolume = shipment.items?.reduce(
      (sum: number, item: any) => sum + (parseFloat(item.volume_m3) || 0),
      0
    ) || 0;
    
    // Calculate days in transit
    let daysInTransit = null;
    if (shipment.actual_delivery_date && shipment.actual_ship_date) {
      const deliveryDate = new Date(shipment.actual_delivery_date);
      const shipDate = new Date(shipment.actual_ship_date);
      daysInTransit = Math.ceil((deliveryDate.getTime() - shipDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    
    // On-time delivery status
    let onTimeStatus = null;
    if (shipment.actual_delivery_date && shipment.estimated_delivery_date) {
      const actualDate = new Date(shipment.actual_delivery_date);
      const estimatedDate = new Date(shipment.estimated_delivery_date);
      onTimeStatus = actualDate <= estimatedDate ? 'on_time' : 'late';
    }
    
    return NextResponse.json({
      ...shipment,
      metrics: {
        total_weight_kg: totalWeight,
        total_volume_m3: totalVolume,
        days_in_transit: daysInTransit,
        on_time_status: onTimeStatus,
        item_count: shipment.items?.length || 0,
        package_count: shipment.packages?.length || 0,
        tracking_event_count: shipment.tracking_events?.length || 0
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching shipment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipment', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/logistics/shipments/[id] - Update shipment
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    // Check if shipment exists
    const checkResult = await client.query(
      'SELECT id, status FROM shipments WHERE id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }
    
    const currentStatus = checkResult.rows[0].status;
    
    // Prevent updates to delivered/cancelled shipments unless specifically allowed
    if (['delivered', 'Delivered', 'cancelled', 'Cancelled'].includes(currentStatus) && 
        !body.allow_update_final_status) {
      return NextResponse.json(
        { error: 'Cannot update shipment in final status' },
        { status: 400 }
      );
    }
    
    await client.query('BEGIN');
    
    // Build dynamic update query
    const allowedFields = [
      'status', 'carrier_id', 'service_type', 'tracking_number', 'carrier_reference',
      'planned_ship_date', 'actual_ship_date', 'estimated_delivery_date', 
      'requested_delivery_date', 'actual_delivery_date', 'delivery_time_slot',
      'priority', 'requires_signature', 'requires_appointment',
      'delivery_instructions', 'notes', 'contact_name', 'contact_phone', 'contact_email',
      'freight_cost', 'fuel_surcharge', 'accessorial_charges', 'total_shipping_cost',
      'pod_signature_url', 'pod_photo_url', 'pod_notes', 'delivered_by', 'received_by',
      'updated_by'
    ];
    
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        paramCount++;
        updates.push(`${field} = $${paramCount}`);
        values.push(body[field]);
      }
    }
    
    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    // Always update updated_at
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    paramCount++;
    values.push(id);
    
    const updateQuery = `
      UPDATE shipments 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await client.query(updateQuery, values);
    const updatedShipment = result.rows[0];
    
    // Create tracking event if status changed
    if (body.status && body.status !== currentStatus) {
      const eventDescriptions: Record<string, string> = {
        'draft': 'Shipment created as draft',
        'pending': 'Shipment pending processing',
        'picked': 'Items picked from warehouse',
        'packed': 'Shipment packed and ready',
        'manifested': 'Shipment manifested with carrier',
        'in_transit': 'Shipment in transit',
        'out_for_delivery': 'Shipment out for delivery',
        'delivered': 'Shipment delivered successfully',
        'failed_delivery': 'Delivery attempt failed',
        'returned': 'Shipment returned',
        'cancelled': 'Shipment cancelled'
      };
      
      await client.query(
        `INSERT INTO shipment_tracking_events (
          shipment_id, event_type, event_status, event_description, event_timestamp, created_by
        ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5)`,
        [
          id,
          body.status,
          ['delivered', 'Delivered'].includes(body.status) ? 'success' : 
          ['failed_delivery', 'cancelled'].includes(body.status) ? 'error' : 'info',
          eventDescriptions[body.status] || `Status changed to ${body.status}`,
          body.updated_by
        ]
      );
    }
    
    await client.query('COMMIT');
    
    return NextResponse.json({
      message: 'Shipment updated successfully',
      shipment: updatedShipment
    });
    
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error updating shipment:', error);
    return NextResponse.json(
      { error: 'Failed to update shipment', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// DELETE /api/logistics/shipments/[id] - Cancel/Delete shipment
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const hard_delete = searchParams.get('hard_delete') === 'true';
    const cancelled_by = parseInt(searchParams.get('cancelled_by') || '1');
    const reason = searchParams.get('reason');
    
    // Check if shipment exists
    const checkResult = await client.query(
      'SELECT id, status, shipment_number FROM shipments WHERE id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }
    
    const shipment = checkResult.rows[0];
    
    // Prevent deletion of delivered shipments
    if (['delivered', 'Delivered'].includes(shipment.status)) {
      return NextResponse.json(
        { error: 'Cannot delete delivered shipments' },
        { status: 400 }
      );
    }
    
    await client.query('BEGIN');
    
    if (hard_delete && ['draft', 'pending'].includes(shipment.status)) {
      // Hard delete only allowed for draft/pending
      await client.query('DELETE FROM shipments WHERE id = $1', [id]);
      
      await client.query('COMMIT');
      return NextResponse.json({
        message: 'Shipment deleted permanently'
      });
      
    } else {
      // Soft delete (mark as cancelled)
      await client.query(
        `UPDATE shipments 
         SET status = 'cancelled', notes = COALESCE(notes || E'\n\n', '') || $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [`Cancelled: ${reason || 'No reason provided'}`, id]
      );
      
      // Create cancellation tracking event
      await client.query(
        `INSERT INTO shipment_tracking_events (
          shipment_id, event_type, event_status, event_description, event_timestamp, created_by
        ) VALUES ($1, 'cancelled', 'error', $2, CURRENT_TIMESTAMP, $3)`,
        [
          id,
          `Shipment ${shipment.shipment_number} cancelled. Reason: ${reason || 'Not specified'}`,
          cancelled_by
        ]
      );
      
      await client.query('COMMIT');
      return NextResponse.json({
        message: 'Shipment cancelled successfully'
      });
    }
    
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error deleting shipment:', error);
    return NextResponse.json(
      { error: 'Failed to delete shipment', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
