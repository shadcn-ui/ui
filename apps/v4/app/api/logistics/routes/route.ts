import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// GET /api/logistics/routes - List delivery routes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    
    const status = searchParams.get('status');
    const driver_id = searchParams.get('driver_id');
    const route_date = searchParams.get('route_date');
    const carrier_id = searchParams.get('carrier_id');
    
    let query = `
      SELECT 
        dr.*,
        u.email as driver_email,
        c.carrier_name,
        lf.facility_name as origin_facility_name,
        COUNT(rs.id) as stop_count,
        COUNT(CASE WHEN rs.status = 'completed' THEN 1 END) as completed_stops,
        COUNT(CASE WHEN rs.status = 'failed' THEN 1 END) as failed_stops,
        ROUND(COUNT(CASE WHEN rs.status = 'completed' THEN 1 END)::NUMERIC / 
              NULLIF(COUNT(rs.id), 0) * 100, 2) as completion_rate,
        SUM(rs.distance_from_previous_km) as total_calculated_distance
      FROM delivery_routes dr
      LEFT JOIN users u ON dr.driver_id = u.id
      LEFT JOIN carriers c ON dr.carrier_id = c.id
      LEFT JOIN logistics_facilities lf ON dr.origin_facility_id = lf.id
      LEFT JOIN route_stops rs ON dr.id = rs.route_id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCount = 0;
    
    if (status) {
      paramCount++;
      query += ` AND dr.status = $${paramCount}`;
      params.push(status);
    }
    
    if (driver_id) {
      paramCount++;
      query += ` AND dr.driver_id = $${paramCount}`;
      params.push(parseInt(driver_id));
    }
    
    if (route_date) {
      paramCount++;
      query += ` AND dr.route_date = $${paramCount}`;
      params.push(route_date);
    }
    
    if (carrier_id) {
      paramCount++;
      query += ` AND dr.carrier_id = $${paramCount}`;
      params.push(parseInt(carrier_id));
    }
    
    // Count total
    const countQuery = query.replace(
      /SELECT[\s\S]*FROM/,
      'SELECT COUNT(DISTINCT dr.id) FROM'
    );
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);
    
    // Add grouping and pagination
    query += `
      GROUP BY dr.id, u.email, c.carrier_name, lf.facility_name
      ORDER BY dr.route_date DESC, dr.id DESC
    `;
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(limit);
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);
    
    const result = await pool.query(query, params);
    
    return NextResponse.json({
      routes: result.rows,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching routes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch routes', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/logistics/routes - Create delivery route
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    
    const {
      route_name,
      route_date,
      driver_id,
      vehicle_id,
      vehicle_type,
      vehicle_capacity_kg,
      carrier_id,
      origin_facility_id,
      planned_start_time,
      planned_end_time,
      optimization_method = 'manual',
      stops = [], // Array of shipment IDs to include in route
      notes,
      created_by
    } = body;
    
    // Validation
    if (!route_name || !route_date) {
      return NextResponse.json(
        { error: 'route_name and route_date are required' },
        { status: 400 }
      );
    }
    
    await client.query('BEGIN');
    
    // Generate route number
    const dateStr = new Date(route_date).toISOString().split('T')[0].replace(/-/g, '');
    const countResult = await client.query(
      `SELECT COUNT(*) FROM delivery_routes WHERE route_number LIKE $1`,
      [`RT-${dateStr}-%`]
    );
    const sequence = parseInt(countResult.rows[0].count) + 1;
    const route_number = `RT-${dateStr}-${sequence.toString().padStart(4, '0')}`;
    
    // Create route
    const routeResult = await client.query(
      `INSERT INTO delivery_routes (
        route_number, route_name, route_date, driver_id, vehicle_id, vehicle_type,
        vehicle_capacity_kg, carrier_id, origin_facility_id, total_stops,
        planned_start_time, planned_end_time, optimization_method, status,
        notes, created_at, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_TIMESTAMP, $16)
      RETURNING *`,
      [
        route_number, route_name, route_date, driver_id, vehicle_id, vehicle_type,
        vehicle_capacity_kg, carrier_id, origin_facility_id, stops.length,
        planned_start_time, planned_end_time, optimization_method, 'planned',
        notes, created_by
      ]
    );
    
    const route = routeResult.rows[0];
    
    // Add stops to route
    if (stops && stops.length > 0) {
      let totalDistance = 0;
      let cumulativeTime = planned_start_time ? new Date(planned_start_time) : new Date();
      
      for (let i = 0; i < stops.length; i++) {
        const stop = stops[i];
        
        // Get shipment details
        const shipmentResult = await client.query(
          `SELECT 
            id, shipment_number, customer_name as destination_name,
            destination_address, destination_city, destination_state,
            destination_latitude, destination_longitude,
            requires_appointment, delivery_time_slot
          FROM shipments
          WHERE id = $1`,
          [stop.shipment_id]
        );
        
        if (shipmentResult.rows.length === 0) {
          throw new Error(`Shipment ${stop.shipment_id} not found`);
        }
        
        const shipment = shipmentResult.rows[0];
        
        // Calculate distance from previous stop (simplified - in reality use maps API)
        const distanceFromPrevious = stop.distance_from_previous_km || (i > 0 ? 10 : 0); // Default 10km
        totalDistance += distanceFromPrevious;
        
        // Calculate arrival time (simplified - 60km/h average speed + 15min service time)
        if (i > 0) {
          const travelMinutes = (distanceFromPrevious / 60) * 60; // Convert to minutes
          cumulativeTime = new Date(cumulativeTime.getTime() + travelMinutes * 60000 + 15 * 60000);
        }
        
        const plannedArrival = cumulativeTime.toISOString();
        const plannedDeparture = new Date(cumulativeTime.getTime() + 15 * 60000).toISOString(); // +15min service time
        
        // Insert route stop
        await client.query(
          `INSERT INTO route_stops (
            route_id, shipment_id, stop_sequence, stop_type,
            location_name, address, latitude, longitude,
            planned_arrival_time, planned_departure_time,
            service_time_minutes, distance_from_previous_km,
            requires_appointment, status, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP)`,
          [
            route.id, stop.shipment_id, i + 1, 'delivery',
            shipment.destination_name, shipment.destination_address,
            shipment.destination_latitude, shipment.destination_longitude,
            plannedArrival, plannedDeparture, 15, distanceFromPrevious,
            shipment.requires_appointment, 'pending'
          ]
        );
        
        cumulativeTime = new Date(plannedDeparture);
      }
      
      // Update route with calculated totals
      const estimatedDuration = Math.ceil((cumulativeTime.getTime() - new Date(planned_start_time || route.created_at).getTime()) / 60000);
      
      await client.query(
        `UPDATE delivery_routes 
         SET total_distance_km = $1, estimated_duration_minutes = $2
         WHERE id = $3`,
        [totalDistance, estimatedDuration, route.id]
      );
    }
    
    await client.query('COMMIT');
    
    // Fetch complete route with stops
    const completeRoute = await pool.query(
      `SELECT dr.*,
        (SELECT json_agg(
          json_build_object(
            'id', rs.id,
            'stop_sequence', rs.stop_sequence,
            'shipment_id', rs.shipment_id,
            'shipment_number', s.shipment_number,
            'location_name', rs.location_name,
            'address', rs.address,
            'planned_arrival_time', rs.planned_arrival_time,
            'planned_departure_time', rs.planned_departure_time,
            'status', rs.status
          ) ORDER BY rs.stop_sequence
        ) FROM route_stops rs
        LEFT JOIN shipments s ON rs.shipment_id = s.id
        WHERE rs.route_id = dr.id) as stops
       FROM delivery_routes dr
       WHERE dr.id = $1`,
      [route.id]
    );
    
    return NextResponse.json({
      message: 'Route created successfully',
      route: completeRoute.rows[0]
    }, { status: 201 });
    
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating route:', error);
    return NextResponse.json(
      { error: 'Failed to create route', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
