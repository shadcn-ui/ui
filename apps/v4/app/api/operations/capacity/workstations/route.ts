import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * GET /api/operations/capacity/workstations
 * Calculate capacity for workstations on a specific date or date range
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workstationId = searchParams.get('workstation_id');
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Single workstation, single date
    if (workstationId && !startDate) {
      const result = await query(
        `SELECT * FROM calculate_workstation_capacity($1::UUID, $2::DATE)`,
        [workstationId, date]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Workstation not found or no capacity data available' },
          { status: 404 }
        );
      }

      const capacity = result.rows[0];
      
      // Get workstation details
      const workstationResult = await query(
        `SELECT id, name, code, description, status 
         FROM workstations 
         WHERE id = $1`,
        [workstationId]
      );

      return NextResponse.json({
        workstation: workstationResult.rows[0],
        date,
        capacity: {
          available_minutes: Number(capacity.available_minutes),
          allocated_minutes: Number(capacity.allocated_minutes),
          free_minutes: Number(capacity.free_minutes),
          utilization_percentage: Number(capacity.utilization_percentage || 0),
        },
      });
    }

    // Date range for single workstation
    if (workstationId && startDate && endDate) {
      const result = await query(
        `SELECT 
          ca.allocation_date,
          ca.available_minutes,
          ca.allocated_minutes,
          ca.overtime_minutes,
          ca.efficiency_percentage,
          ca.utilization_percentage
         FROM capacity_allocations ca
         WHERE ca.workstation_id = $1
         AND ca.allocation_date BETWEEN $2 AND $3
         ORDER BY ca.allocation_date`,
        [workstationId, startDate, endDate]
      );

      return NextResponse.json({
        workstation_id: workstationId,
        start_date: startDate,
        end_date: endDate,
        allocations: result.rows.map(row => ({
          date: row.allocation_date,
          available_minutes: Number(row.available_minutes),
          allocated_minutes: Number(row.allocated_minutes),
          overtime_minutes: Number(row.overtime_minutes),
          efficiency_percentage: Number(row.efficiency_percentage),
          utilization_percentage: Number(row.utilization_percentage || 0),
        })),
      });
    }

    // All workstations for a specific date
    const result = await query(
      `SELECT 
        w.id,
        w.name,
        w.code,
        w.status,
        COALESCE(SUM(ws.end_time::time - ws.start_time::time - 
          (ws.break_duration_minutes || ' minutes')::interval), '0 minutes'::interval) as total_available,
        COALESCE(ca.allocated_minutes, 0) as allocated_minutes,
        COALESCE(ca.utilization_percentage, 0) as utilization_percentage
       FROM workstations w
       LEFT JOIN workstation_shifts ws ON ws.workstation_id = w.id 
         AND ws.is_active = true
         AND ws.day_of_week = EXTRACT(DOW FROM $1::DATE)
       LEFT JOIN capacity_allocations ca ON ca.workstation_id = w.id 
         AND ca.allocation_date = $1
       WHERE w.status = 'active'
       GROUP BY w.id, w.name, w.code, w.status, ca.allocated_minutes, ca.utilization_percentage
       ORDER BY w.name`,
      [date]
    );

    return NextResponse.json({
      date,
      workstations: result.rows.map(row => ({
        id: row.id,
        name: row.name,
        code: row.code,
        status: row.status,
        available_minutes: Number(row.total_available?.hours || 0) * 60 + Number(row.total_available?.minutes || 0),
        allocated_minutes: Number(row.allocated_minutes),
        utilization_percentage: Number(row.utilization_percentage || 0),
      })),
    });
  } catch (error: any) {
    console.error('Capacity workstations API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workstation capacity', details: error.message },
      { status: 500 }
    );
  }
}
