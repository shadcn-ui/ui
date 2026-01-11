import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface RoutingRequest {
  origin_location_id?: number;
  shipment_ids?: number[];
  optimization_goal?: 'minimize_cost' | 'minimize_time' | 'balanced';
  max_stops?: number;
}

interface RouteStop {
  stop_number: number;
  location_id: number;
  location_name: string;
  address: string;
  city: string;
  shipment_ids: number[];
  delivery_count: number;
  estimated_duration_minutes: number;
  arrival_time?: string;
}

interface RouteRecommendation {
  route_id: string;
  origin: {
    location_id: number;
    location_name: string;
    city: string;
  };
  stops: RouteStop[];
  metrics: {
    total_stops: number;
    total_distance_km: number;
    total_duration_hours: number;
    total_shipments: number;
    estimated_cost: number;
    estimated_fuel_cost: number;
    carrier_cost: number;
  };
  optimization_score: number;
  recommended_carrier?: {
    carrier_id: number;
    carrier_name: string;
    carrier_type: string;
    estimated_cost: number;
  };
}

/**
 * @swagger
 * /api/analytics/recommendations/routing:
 *   get:
 *     summary: Get optimized logistics routing recommendations
 *     description: Calculate optimal delivery routes considering distance, time, cost, and carrier selection
 *     tags: [Prescriptive Analytics]
 *     parameters:
 *       - in: query
 *         name: origin_location_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: optimization_goal
 *         schema:
 *           type: string
 *           enum: [minimize_cost, minimize_time, balanced]
 *           default: balanced
 *       - in: query
 *         name: max_stops
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Optimized route recommendations
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const origin_location_id = searchParams.get('origin_location_id');
    const optimization_goal = (searchParams.get('optimization_goal') || 'balanced') as RoutingRequest['optimization_goal'];
    const max_stops = parseInt(searchParams.get('max_stops') || '10');

    const startTime = Date.now();

    // Get pending shipments that need routing
    const shipmentsQuery = `
      WITH pending_shipments AS (
        SELECT 
          s.shipment_id,
          s.sales_order_id,
          s.origin_location_id,
          s.destination_location_id,
          s.scheduled_ship_date,
          s.estimated_delivery_date,
          s.status,
          
          -- Origin details
          origin_loc.location_name as origin_name,
          origin_loc.city as origin_city,
          origin_loc.region as origin_region,
          
          -- Destination details
          dest_loc.location_name as dest_name,
          dest_loc.address as dest_address,
          dest_loc.city as dest_city,
          dest_loc.region as dest_region,
          dest_loc.country as dest_country,
          dest_loc.latitude as dest_lat,
          dest_loc.longitude as dest_lng,
          
          -- Shipment size
          COUNT(si.shipment_item_id) as item_count,
          SUM(si.quantity) as total_quantity,
          
          -- Order value
          so.total_amount as order_value
          
        FROM shipments s
        JOIN locations origin_loc ON s.origin_location_id = origin_loc.location_id
        JOIN locations dest_loc ON s.destination_location_id = dest_loc.location_id
        LEFT JOIN shipment_items si ON s.shipment_id = si.shipment_id
        LEFT JOIN sales_orders so ON s.sales_order_id = so.order_id
        WHERE s.status IN ('pending', 'ready_to_ship')
          ${origin_location_id ? `AND s.origin_location_id = $1` : ''}
          AND s.scheduled_ship_date <= CURRENT_DATE + INTERVAL '7 days'
        GROUP BY 
          s.shipment_id, s.sales_order_id, s.origin_location_id, s.destination_location_id,
          s.scheduled_ship_date, s.estimated_delivery_date, s.status,
          origin_loc.location_name, origin_loc.city, origin_loc.region,
          dest_loc.location_name, dest_loc.address, dest_loc.city, dest_loc.region, 
          dest_loc.country, dest_loc.latitude, dest_loc.longitude, so.total_amount
      ),
      destination_groups AS (
        -- Group shipments by destination for multi-stop optimization
        SELECT 
          destination_location_id,
          dest_name,
          dest_address,
          dest_city,
          dest_region,
          dest_country,
          dest_lat,
          dest_lng,
          ARRAY_AGG(shipment_id ORDER BY scheduled_ship_date) as shipment_ids,
          COUNT(*) as shipment_count,
          SUM(total_quantity) as total_items,
          SUM(order_value) as total_value,
          MIN(scheduled_ship_date) as earliest_ship_date,
          
          -- Estimate distance from origin (simplified - in real system use actual routing API)
          -- Using rough approximation: 1 degree ≈ 111km
          CASE 
            WHEN dest_lat IS NOT NULL THEN
              ABS(dest_lat - 37.7749) * 111  -- Example: San Francisco as default origin
            ELSE 500  -- Default distance if no coordinates
          END as estimated_distance_km,
          
          -- Estimate delivery duration
          CASE 
            WHEN dest_region = origin_region THEN 2  -- Same region: 2 hours
            WHEN dest_country = origin_country THEN 6  -- Same country: 6 hours
            ELSE 24  -- International: 24+ hours
          END as estimated_duration_hours
          
        FROM pending_shipments
        GROUP BY 
          destination_location_id, dest_name, dest_address, dest_city, 
          dest_region, dest_country, dest_lat, dest_lng, origin_region, origin_country
      ),
      route_optimization AS (
        SELECT 
          dg.*,
          
          -- Calculate costs based on optimization goal
          CASE 
            WHEN $${origin_location_id ? '2' : '1'} = 'minimize_cost' THEN
              -- Prioritize consolidation and cheapest carriers
              (estimated_distance_km * 0.5) + (shipment_count * 10)
            WHEN $${origin_location_id ? '2' : '1'} = 'minimize_time' THEN
              -- Prioritize speed and direct routes
              (estimated_duration_hours * 50) + (shipment_count * 5)
            ELSE
              -- Balanced: optimize for both cost and time
              (estimated_distance_km * 0.3) + (estimated_duration_hours * 30) + (shipment_count * 8)
          END as optimization_score,
          
          -- Estimate costs
          (estimated_distance_km * 0.5) as estimated_fuel_cost,
          (estimated_distance_km * 1.2) + (shipment_count * 25) as carrier_cost,
          
          -- Stop duration estimate (loading/unloading)
          30 + (shipment_count * 10) as stop_duration_minutes
          
        FROM destination_groups dg
      )
      SELECT *
      FROM route_optimization
      ORDER BY optimization_score ASC
      LIMIT $${origin_location_id ? '3' : '2'}
    `;

    const params: any[] = [];
    if (origin_location_id) params.push(origin_location_id);
    params.push(optimization_goal);
    params.push(max_stops);

    const result = await query(shipmentsQuery, params);

    if (result.rows.length === 0) {
      return NextResponse.json({
        recommendations: [],
        message: 'No pending shipments found for routing optimization',
        metadata: {
          execution_time_ms: Date.now() - startTime,
          generated_at: new Date().toISOString()
        }
      });
    }

    // Get origin location details
    let originLocation: any = null;
    if (origin_location_id) {
      const originQuery = `
        SELECT location_id, location_name, city, region, country
        FROM locations
        WHERE location_id = $1
      `;
      const originResult = await query(originQuery, [origin_location_id]);
      originLocation = originResult.rows[0];
    }

    // Build route recommendations
    const routes: RouteRecommendation[] = [];
    
    // For now, create one optimized route with all stops
    // In production, this would use actual routing algorithms (TSP, VRP)
    const stops: RouteStop[] = result.rows.map((row, index) => ({
      stop_number: index + 1,
      location_id: parseInt(row.destination_location_id),
      location_name: row.dest_name,
      address: row.dest_address,
      city: row.dest_city,
      shipment_ids: row.shipment_ids,
      delivery_count: parseInt(row.shipment_count),
      estimated_duration_minutes: parseInt(row.stop_duration_minutes)
    }));

    const totalDistance = result.rows.reduce((sum: number, row: any) => sum + parseFloat(row.estimated_distance_km), 0);
    const totalDuration = result.rows.reduce((sum: number, row: any) => sum + parseFloat(row.estimated_duration_hours), 0);
    const totalShipments = result.rows.reduce((sum: number, row: any) => sum + parseInt(row.shipment_count), 0);
    const totalFuelCost = result.rows.reduce((sum: number, row: any) => sum + parseFloat(row.estimated_fuel_cost), 0);
    const totalCarrierCost = result.rows.reduce((sum: number, row: any) => sum + parseFloat(row.carrier_cost), 0);

    // Select recommended carrier based on route characteristics
    const carrierQuery = `
      SELECT 
        carrier_id,
        carrier_name,
        carrier_type,
        base_rate,
        per_km_rate
      FROM carriers
      WHERE is_active = true
      ORDER BY 
        CASE 
          WHEN $1 = 'minimize_cost' THEN base_rate + (per_km_rate * $2)
          WHEN $1 = 'minimize_time' THEN base_rate  -- Favor express carriers
          ELSE (base_rate + (per_km_rate * $2)) * 0.8  -- Balanced
        END
      LIMIT 1
    `;

    let recommendedCarrier = null;
    try {
      const carrierResult = await query(carrierQuery, [optimization_goal, totalDistance]);
      if (carrierResult.rows.length > 0) {
        const carrier = carrierResult.rows[0];
        recommendedCarrier = {
          carrier_id: parseInt(carrier.carrier_id),
          carrier_name: carrier.carrier_name,
          carrier_type: carrier.carrier_type,
          estimated_cost: parseFloat(carrier.base_rate) + (parseFloat(carrier.per_km_rate) * totalDistance)
        };
      }
    } catch (err) {
      console.log('Carrier selection skipped - table may not exist');
    }

    const route: RouteRecommendation = {
      route_id: `ROUTE-${Date.now()}`,
      origin: originLocation ? {
        location_id: parseInt(originLocation.location_id),
        location_name: originLocation.location_name,
        city: originLocation.city
      } : {
        location_id: 0,
        location_name: 'Default Warehouse',
        city: 'San Francisco'
      },
      stops,
      metrics: {
        total_stops: stops.length,
        total_distance_km: parseFloat(totalDistance.toFixed(2)),
        total_duration_hours: parseFloat(totalDuration.toFixed(2)),
        total_shipments: totalShipments,
        estimated_cost: parseFloat((totalFuelCost + totalCarrierCost).toFixed(2)),
        estimated_fuel_cost: parseFloat(totalFuelCost.toFixed(2)),
        carrier_cost: parseFloat(totalCarrierCost.toFixed(2))
      },
      optimization_score: parseFloat(result.rows[0].optimization_score.toFixed(2)),
      recommended_carrier: recommendedCarrier || undefined
    };

    routes.push(route);

    const executionTime = Date.now() - startTime;

    return NextResponse.json({
      recommendations: routes,
      optimization_goal,
      summary: {
        total_routes: routes.length,
        total_shipments: totalShipments,
        total_distance_km: parseFloat(totalDistance.toFixed(2)),
        total_estimated_cost: parseFloat((totalFuelCost + totalCarrierCost).toFixed(2)),
        avg_stops_per_route: stops.length
      },
      metadata: {
        execution_time_ms: executionTime,
        generated_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in routing recommendations API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint to create route from recommendation
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { route_id, shipment_ids, carrier_id, scheduled_date, driver_id } = body;

    if (!shipment_ids || shipment_ids.length === 0) {
      return NextResponse.json(
        { error: 'shipment_ids array is required' },
        { status: 400 }
      );
    }

    // Create route record
    const createRouteQuery = `
      INSERT INTO delivery_routes (
        route_name,
        carrier_id,
        scheduled_date,
        driver_id,
        status,
        created_at
      ) VALUES ($1, $2, $3, $4, 'planned', CURRENT_TIMESTAMP)
      RETURNING route_id
    `;

    const routeName = `Route ${new Date().toISOString().split('T')[0]}`;
    const routeResult = await query(createRouteQuery, [
      routeName,
      carrier_id || null,
      scheduled_date || new Date(),
      driver_id || null
    ]);

    const newRouteId = routeResult.rows[0].route_id;

    // Assign shipments to route
    const assignShipmentsQuery = `
      UPDATE shipments
      SET 
        route_id = $1,
        status = 'assigned_to_route',
        updated_at = CURRENT_TIMESTAMP
      WHERE shipment_id = ANY($2::INTEGER[])
      RETURNING shipment_id
    `;

    await query(assignShipmentsQuery, [newRouteId, shipment_ids]);

    return NextResponse.json({
      success: true,
      route_id: newRouteId,
      shipments_assigned: shipment_ids.length,
      message: 'Route created and shipments assigned'
    });

  } catch (error) {
    console.error('Error creating route from recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to create route', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
