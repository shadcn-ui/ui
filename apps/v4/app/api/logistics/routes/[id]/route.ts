import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// GET /api/logistics/routes/[id] - Get route details with all stops
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    const result = await pool.query(
      `SELECT 
        dr.*,
        u.email as driver_email,
        c.carrier_name,
        c.carrier_code,
        lf.facility_name as origin_facility_name,
        lf.address_line1 as origin_address,
        lf.city as origin_city,
        (SELECT json_agg(
          json_build_object(
            'id', rs.id,
            'stop_sequence', rs.stop_sequence,
            'stop_type', rs.stop_type,
            'shipment_id', rs.shipment_id,
            'shipment_number', s.shipment_number,
            'location_name', rs.location_name,
            'address', rs.address,
            'latitude', rs.latitude,
            'longitude', rs.longitude,
            'planned_arrival_time', rs.planned_arrival_time,
            'actual_arrival_time', rs.actual_arrival_time,
            'planned_departure_time', rs.planned_departure_time,
            'actual_departure_time', rs.actual_departure_time,
            'time_window_start', rs.time_window_start,
            'time_window_end', rs.time_window_end,
            'service_time_minutes', rs.service_time_minutes,
            'distance_from_previous_km', rs.distance_from_previous_km,
            'status', rs.status,
            'requires_appointment', rs.requires_appointment,
            'is_priority', rs.is_priority,
            'delivery_notes', rs.delivery_notes,
            'failure_reason', rs.failure_reason,
            'proof_of_delivery_url', rs.proof_of_delivery_url
          ) ORDER BY rs.stop_sequence
        ) FROM route_stops rs
        LEFT JOIN shipments s ON rs.shipment_id = s.id
        WHERE rs.route_id = dr.id) as stops
      FROM delivery_routes dr
      LEFT JOIN users u ON dr.driver_id = u.id
      LEFT JOIN carriers c ON dr.carrier_id = c.id
      LEFT JOIN logistics_facilities lf ON dr.origin_facility_id = lf.id
      WHERE dr.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Route not found' },
        { status: 404 }
      );
    }
    
    const route = result.rows[0];
    
    // Calculate route metrics
    const stops = route.stops || [];
    const completedStops = stops.filter((s: any) => s.status === 'completed').length;
    const failedStops = stops.filter((s: any) => s.status === 'failed').length;
    const pendingStops = stops.filter((s: any) => s.status === 'pending').length;
    
    return NextResponse.json({
      ...route,
      metrics: {
        total_stops: stops.length,
        completed_stops: completedStops,
        failed_stops: failedStops,
        pending_stops: pendingStops,
        completion_rate: stops.length > 0 ? (completedStops / stops.length * 100).toFixed(2) : 0
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch route', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/logistics/routes/[id] - Update route
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    // Check if route exists
    const checkResult = await client.query(
      'SELECT id, status FROM delivery_routes WHERE id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Route not found' },
        { status: 404 }
      );
    }
    
    await client.query('BEGIN');
    
    // Build dynamic update query
    const allowedFields = [
      'route_name', 'driver_id', 'vehicle_id', 'vehicle_type', 'vehicle_capacity_kg',
      'carrier_id', 'status', 'planned_start_time', 'actual_start_time',
      'planned_end_time', 'actual_end_time', 'total_distance_km',
      'estimated_duration_minutes', 'actual_duration_minutes',
      'estimated_cost', 'actual_cost', 'fuel_cost', 'notes', 'sequence_locked'
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
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    paramCount++;
    values.push(id);
    
    const updateQuery = `
      UPDATE delivery_routes 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await client.query(updateQuery, values);
    
    await client.query('COMMIT');
    
    return NextResponse.json({
      message: 'Route updated successfully',
      route: result.rows[0]
    });
    
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error updating route:', error);
    return NextResponse.json(
      { error: 'Failed to update route', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// DELETE /api/logistics/routes/[id] - Delete route
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  
  try {
    const { id } = await context.params;
    
    // Check if route exists
    const checkResult = await client.query(
      'SELECT id, status, route_number FROM delivery_routes WHERE id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Route not found' },
        { status: 404 }
      );
    }
    
    const route = checkResult.rows[0];
    
    // Prevent deletion of completed routes
    if (route.status === 'completed') {
      return NextResponse.json(
        { error: 'Cannot delete completed routes' },
        { status: 400 }
      );
    }
    
    await client.query('BEGIN');
    
    // Delete route (cascade will delete stops)
    await client.query('DELETE FROM delivery_routes WHERE id = $1', [id]);
    
    await client.query('COMMIT');
    
    return NextResponse.json({
      message: 'Route deleted successfully'
    });
    
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error deleting route:', error);
    return NextResponse.json(
      { error: 'Failed to delete route', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
