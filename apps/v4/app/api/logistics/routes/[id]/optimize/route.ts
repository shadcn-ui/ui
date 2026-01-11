import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// Simple greedy nearest neighbor algorithm for route optimization
function optimizeRouteGreedy(stops: any[], origin: { lat: number; lng: number }) {
  if (stops.length <= 1) return stops;
  
  const optimized: any[] = [];
  const remaining = [...stops];
  let current = origin;
  
  while (remaining.length > 0) {
    // Find nearest unvisited stop
    let nearestIndex = 0;
    let nearestDistance = calculateDistance(
      current.lat,
      current.lng,
      remaining[0].latitude || 0,
      remaining[0].longitude || 0
    );
    
    for (let i = 1; i < remaining.length; i++) {
      const distance = calculateDistance(
        current.lat,
        current.lng,
        remaining[i].latitude || 0,
        remaining[i].longitude || 0
      );
      
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }
    
    const nearest = remaining.splice(nearestIndex, 1)[0];
    optimized.push({
      ...nearest,
      distance_from_previous_km: nearestDistance
    });
    
    current = {
      lat: nearest.latitude || 0,
      lng: nearest.longitude || 0
    };
  }
  
  return optimized;
}

// Haversine formula for distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// POST /api/logistics/routes/[id]/optimize - Optimize route stop sequence
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const {
      optimization_method = 'distance', // 'distance', 'time', 'priority'
      respect_time_windows = true,
      lock_priority_stops = true
    } = body;
    
    // Check if route exists and not locked
    const routeResult = await client.query(
      `SELECT dr.*, lf.latitude as origin_lat, lf.longitude as origin_lng
       FROM delivery_routes dr
       LEFT JOIN logistics_facilities lf ON dr.origin_facility_id = lf.id
       WHERE dr.id = $1`,
      [id]
    );
    
    if (routeResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Route not found' },
        { status: 404 }
      );
    }
    
    const route = routeResult.rows[0];
    
    if (route.sequence_locked) {
      return NextResponse.json(
        { error: 'Route sequence is locked and cannot be optimized' },
        { status: 400 }
      );
    }
    
    if (route.status === 'completed') {
      return NextResponse.json(
        { error: 'Cannot optimize completed routes' },
        { status: 400 }
      );
    }
    
    // Get all stops for this route
    const stopsResult = await client.query(
      `SELECT rs.*, s.priority as shipment_priority
       FROM route_stops rs
       LEFT JOIN shipments s ON rs.shipment_id = s.id
       WHERE rs.route_id = $1
       ORDER BY rs.stop_sequence`,
      [id]
    );
    
    const stops = stopsResult.rows;
    
    if (stops.length <= 1) {
      return NextResponse.json(
        { error: 'Route must have at least 2 stops to optimize' },
        { status: 400 }
      );
    }
    
    await client.query('BEGIN');
    
    // Separate priority stops if needed
    let priorityStops: any[] = [];
    let regularStops = stops;
    
    if (lock_priority_stops) {
      priorityStops = stops.filter(s => s.is_priority || s.shipment_priority === 'urgent');
      regularStops = stops.filter(s => !s.is_priority && s.shipment_priority !== 'urgent');
    }
    
    // Optimize regular stops
    const origin = {
      lat: route.origin_lat || 34.0522,
      lng: route.origin_lng || -118.2437
    };
    
    let optimizedStops: any[] = [];
    
    switch (optimization_method) {
      case 'distance':
        optimizedStops = optimizeRouteGreedy(regularStops, origin);
        break;
      
      case 'time':
        // Sort by time windows
        optimizedStops = regularStops.sort((a, b) => {
          if (a.time_window_start && b.time_window_start) {
            return a.time_window_start.localeCompare(b.time_window_start);
          }
          return 0;
        });
        break;
      
      case 'priority':
        // Sort by priority, then distance
        optimizedStops = regularStops.sort((a, b) => {
          const priorityOrder: any = { 'urgent': 1, 'high': 2, 'normal': 3, 'low': 4 };
          return (priorityOrder[a.shipment_priority] || 3) - (priorityOrder[b.shipment_priority] || 3);
        });
        break;
      
      default:
        optimizedStops = regularStops;
    }
    
    // Combine priority stops (at start) with optimized regular stops
    const finalStops = [...priorityStops, ...optimizedStops];
    
    // Update stop sequences and distances
    let totalDistance = 0;
    let prevLat = origin.lat;
    let prevLng = origin.lng;
    
    for (let i = 0; i < finalStops.length; i++) {
      const stop = finalStops[i];
      const distance = calculateDistance(
        prevLat,
        prevLng,
        stop.latitude || 0,
        stop.longitude || 0
      );
      
      totalDistance += distance;
      
      await client.query(
        `UPDATE route_stops 
         SET stop_sequence = $1, distance_from_previous_km = $2
         WHERE id = $3`,
        [i + 1, distance.toFixed(2), stop.id]
      );
      
      prevLat = stop.latitude || prevLat;
      prevLng = stop.longitude || prevLng;
    }
    
    // Update route with new totals
    const avgSpeed = 50; // km/h
    const avgServiceTime = 15; // minutes per stop
    const estimatedDuration = Math.ceil((totalDistance / avgSpeed) * 60 + (finalStops.length * avgServiceTime));
    
    await client.query(
      `UPDATE delivery_routes 
       SET total_distance_km = $1, 
           estimated_duration_minutes = $2,
           optimization_method = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [totalDistance.toFixed(2), estimatedDuration, optimization_method, id]
    );
    
    await client.query('COMMIT');
    
    // Fetch optimized route
    const optimizedRoute = await pool.query(
      `SELECT dr.*,
        (SELECT json_agg(
          json_build_object(
            'id', rs.id,
            'stop_sequence', rs.stop_sequence,
            'shipment_id', rs.shipment_id,
            'location_name', rs.location_name,
            'distance_from_previous_km', rs.distance_from_previous_km
          ) ORDER BY rs.stop_sequence
        ) FROM route_stops rs WHERE rs.route_id = dr.id) as stops
       FROM delivery_routes dr
       WHERE dr.id = $1`,
      [id]
    );
    
    return NextResponse.json({
      message: 'Route optimized successfully',
      route: optimizedRoute.rows[0],
      optimization: {
        method: optimization_method,
        total_distance_km: totalDistance.toFixed(2),
        estimated_duration_minutes: estimatedDuration,
        stops_optimized: finalStops.length,
        priority_stops_locked: priorityStops.length
      }
    });
    
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error optimizing route:', error);
    return NextResponse.json(
      { error: 'Failed to optimize route', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
