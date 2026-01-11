import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// GET /api/logistics/analytics/performance - Delivery performance metrics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const period_days = parseInt(searchParams.get('period_days') || '30');
    const carrier_id = searchParams.get('carrier_id');
    const delivery_zone_id = searchParams.get('delivery_zone_id');
    const group_by = searchParams.get('group_by') || 'overall'; // 'overall', 'carrier', 'zone', 'day'
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period_days);
    const startDateStr = startDate.toISOString().split('T')[0];
    
    let query = ``;
    const params: any[] = [startDateStr];
    let paramCount = 1;
    
    // Build query based on grouping
    switch (group_by) {
      case 'carrier':
        query = `
          SELECT 
            c.id as carrier_id,
            c.carrier_name,
            c.carrier_type,
            COUNT(DISTINCT s.id) as total_shipments,
            COUNT(CASE WHEN s.status = 'delivered' THEN 1 END) as delivered_shipments,
            COUNT(CASE WHEN s.status = 'failed_delivery' THEN 1 END) as failed_deliveries,
            COUNT(CASE 
              WHEN s.actual_delivery_date <= s.estimated_delivery_date 
              AND s.status = 'delivered'
              THEN 1 
            END) as on_time_deliveries,
            ROUND(
              COUNT(CASE 
                WHEN s.actual_delivery_date <= s.estimated_delivery_date 
                AND s.status = 'delivered'
                THEN 1 
              END)::NUMERIC / 
              NULLIF(COUNT(CASE WHEN s.status = 'delivered' THEN 1 END), 0) * 100, 
              2
            ) as on_time_percentage,
            ROUND(AVG(EXTRACT(DAY FROM (s.actual_delivery_date::timestamp - s.actual_ship_date::timestamp))), 2) as avg_delivery_days,
            ROUND(AVG(s.total_shipping_cost), 2) as avg_cost,
            SUM(s.total_shipping_cost) as total_cost,
            ROUND(SUM(s.total_weight_kg), 2) as total_weight_kg,
            COUNT(CASE WHEN s.actual_delivery_date > s.estimated_delivery_date THEN 1 END) as late_deliveries,
            ROUND(AVG(CASE 
              WHEN s.actual_delivery_date > s.estimated_delivery_date 
              THEN EXTRACT(DAY FROM (s.actual_delivery_date::timestamp - s.estimated_delivery_date::timestamp))
            END), 2) as avg_delay_days
          FROM carriers c
          LEFT JOIN shipments s ON c.id = s.carrier_id 
            AND COALESCE(s.actual_ship_date, s.planned_ship_date, s.shipment_date) >= $1
        `;
        
        if (carrier_id) {
          paramCount++;
          query += ` AND c.id = $${paramCount}`;
          params.push(parseInt(carrier_id));
        }
        
        query += `
          WHERE c.is_active = true
          GROUP BY c.id, c.carrier_name, c.carrier_type
          HAVING COUNT(DISTINCT s.id) > 0
          ORDER BY on_time_percentage DESC, total_shipments DESC
        `;
        break;
      
      case 'zone':
        query = `
          SELECT 
            dz.id as zone_id,
            dz.zone_name,
            dz.zone_code,
            dz.delivery_sla_hours,
            COUNT(DISTINCT s.id) as total_shipments,
            COUNT(CASE WHEN s.status = 'delivered' THEN 1 END) as delivered_shipments,
            COUNT(CASE 
              WHEN s.actual_delivery_date <= s.estimated_delivery_date 
              AND s.status = 'delivered'
              THEN 1 
            END) as on_time_deliveries,
            ROUND(
              COUNT(CASE 
                WHEN s.actual_delivery_date <= s.estimated_delivery_date 
                AND s.status = 'delivered'
                THEN 1 
              END)::NUMERIC / 
              NULLIF(COUNT(CASE WHEN s.status = 'delivered' THEN 1 END), 0) * 100, 
              2
            ) as on_time_percentage,
            ROUND(AVG(EXTRACT(DAY FROM (s.actual_delivery_date::timestamp - s.actual_ship_date::timestamp))), 2) as avg_delivery_days,
            ROUND(AVG(s.total_shipping_cost), 2) as avg_cost,
            COUNT(CASE WHEN s.status = 'failed_delivery' THEN 1 END) as failed_deliveries
          FROM delivery_zones dz
          LEFT JOIN shipments s ON dz.id = s.delivery_zone_id 
            AND COALESCE(s.actual_ship_date, s.planned_ship_date, s.shipment_date) >= $1
        `;
        
        if (delivery_zone_id) {
          paramCount++;
          query += ` AND dz.id = $${paramCount}`;
          params.push(parseInt(delivery_zone_id));
        }
        
        query += `
          WHERE dz.is_active = true
          GROUP BY dz.id, dz.zone_name, dz.zone_code, dz.delivery_sla_hours
          HAVING COUNT(DISTINCT s.id) > 0
          ORDER BY total_shipments DESC
        `;
        break;
      
      case 'day':
        query = `
          SELECT 
            DATE(COALESCE(s.actual_ship_date, s.planned_ship_date, s.shipment_date)) as date,
            COUNT(DISTINCT s.id) as total_shipments,
            COUNT(CASE WHEN s.status = 'delivered' THEN 1 END) as delivered_shipments,
            COUNT(CASE 
              WHEN s.actual_delivery_date <= s.estimated_delivery_date 
              AND s.status = 'delivered'
              THEN 1 
            END) as on_time_deliveries,
            ROUND(
              COUNT(CASE 
                WHEN s.actual_delivery_date <= s.estimated_delivery_date 
                AND s.status = 'delivered'
                THEN 1 
              END)::NUMERIC / 
              NULLIF(COUNT(CASE WHEN s.status = 'delivered' THEN 1 END), 0) * 100, 
              2
            ) as on_time_percentage,
            ROUND(AVG(s.total_shipping_cost), 2) as avg_cost,
            SUM(s.total_shipping_cost) as total_cost,
            COUNT(CASE WHEN s.status = 'failed_delivery' THEN 1 END) as failed_deliveries
          FROM shipments s
          WHERE COALESCE(s.actual_ship_date, s.planned_ship_date, s.shipment_date) >= $1
        `;
        
        if (carrier_id) {
          paramCount++;
          query += ` AND s.carrier_id = $${paramCount}`;
          params.push(parseInt(carrier_id));
        }
        
        query += `
          GROUP BY DATE(COALESCE(s.actual_ship_date, s.planned_ship_date, s.shipment_date))
          ORDER BY date DESC
        `;
        break;
      
      default: // 'overall'
        query = `
          SELECT 
            COUNT(DISTINCT s.id) as total_shipments,
            COUNT(CASE WHEN s.status = 'delivered' THEN 1 END) as delivered_shipments,
            COUNT(CASE WHEN s.status = 'in_transit' THEN 1 END) as in_transit_shipments,
            COUNT(CASE WHEN s.status = 'out_for_delivery' THEN 1 END) as out_for_delivery_shipments,
            COUNT(CASE WHEN s.status = 'failed_delivery' THEN 1 END) as failed_deliveries,
            COUNT(CASE WHEN s.status = 'cancelled' THEN 1 END) as cancelled_shipments,
            COUNT(CASE 
              WHEN s.actual_delivery_date <= s.estimated_delivery_date 
              AND s.status = 'delivered'
              THEN 1 
            END) as on_time_deliveries,
            ROUND(
              COUNT(CASE 
                WHEN s.actual_delivery_date <= s.estimated_delivery_date 
                AND s.status = 'delivered'
                THEN 1 
              END)::NUMERIC / 
              NULLIF(COUNT(CASE WHEN s.status = 'delivered' THEN 1 END), 0) * 100, 
              2
            ) as on_time_percentage,
            ROUND(AVG(EXTRACT(DAY FROM (s.actual_delivery_date::timestamp - s.actual_ship_date::timestamp))), 2) as avg_delivery_days,
            ROUND(AVG(s.total_shipping_cost), 2) as avg_cost_per_shipment,
            SUM(s.total_shipping_cost) as total_shipping_cost,
            ROUND(SUM(s.total_weight_kg), 2) as total_weight_kg,
            COUNT(DISTINCT s.carrier_id) as carriers_used,
            COUNT(DISTINCT s.delivery_zone_id) as zones_served,
            COUNT(CASE WHEN s.actual_delivery_date > s.estimated_delivery_date THEN 1 END) as late_deliveries,
            ROUND(AVG(CASE 
              WHEN s.actual_delivery_date > s.estimated_delivery_date 
              THEN EXTRACT(DAY FROM (s.actual_delivery_date::timestamp - s.estimated_delivery_date::timestamp))
            END), 2) as avg_delay_days,
            COUNT(CASE WHEN s.priority = 'urgent' THEN 1 END) as urgent_shipments,
            COUNT(CASE WHEN s.requires_signature = true THEN 1 END) as signature_required_shipments
          FROM shipments s
          WHERE COALESCE(s.actual_ship_date, s.planned_ship_date, s.shipment_date) >= $1
        `;
        
        if (carrier_id) {
          paramCount++;
          query += ` AND s.carrier_id = $${paramCount}`;
          params.push(parseInt(carrier_id));
        }
        
        if (delivery_zone_id) {
          paramCount++;
          query += ` AND s.delivery_zone_id = $${paramCount}`;
          params.push(parseInt(delivery_zone_id));
        }
    }
    
    const result = await pool.query(query, params);
    
    return NextResponse.json({
      period: {
        start_date: startDateStr,
        end_date: new Date().toISOString().split('T')[0],
        days: period_days
      },
      group_by,
      filters: {
        carrier_id: carrier_id ? parseInt(carrier_id) : null,
        delivery_zone_id: delivery_zone_id ? parseInt(delivery_zone_id) : null
      },
      metrics: group_by === 'overall' ? result.rows[0] : result.rows
    });
    
  } catch (error: any) {
    console.error('Error fetching performance analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance analytics', details: error.message },
      { status: 500 }
    );
  }
}
