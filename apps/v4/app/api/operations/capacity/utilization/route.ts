import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * GET /api/operations/capacity/utilization
 * Get capacity utilization statistics and trends
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workstationId = searchParams.get('workstation_id');
    const startDate = searchParams.get('start_date') || 
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = searchParams.get('end_date') || 
      new Date().toISOString().split('T')[0];
    const groupBy = searchParams.get('group_by') || 'day'; // day, week, month

    // Single workstation utilization trend
    if (workstationId) {
      const result = await query(
        `SELECT 
          ca.allocation_date,
          ca.available_minutes,
          ca.allocated_minutes,
          ca.overtime_minutes,
          ca.utilization_percentage,
          ca.efficiency_percentage,
          CASE 
            WHEN ca.utilization_percentage >= 100 THEN 'overloaded'
            WHEN ca.utilization_percentage >= 85 THEN 'high'
            WHEN ca.utilization_percentage >= 60 THEN 'optimal'
            WHEN ca.utilization_percentage >= 30 THEN 'low'
            ELSE 'idle'
          END as load_status
         FROM capacity_allocations ca
         WHERE ca.workstation_id = $1
         AND ca.allocation_date BETWEEN $2 AND $3
         ORDER BY ca.allocation_date`,
        [workstationId, startDate, endDate]
      );

      // Calculate statistics
      const allocations = result.rows;
      const totalDays = allocations.length;
      const avgUtilization = totalDays > 0
        ? allocations.reduce((sum, row) => sum + Number(row.utilization_percentage || 0), 0) / totalDays
        : 0;
      const overloadedDays = allocations.filter(row => Number(row.utilization_percentage) >= 100).length;
      const idleDays = allocations.filter(row => Number(row.utilization_percentage) < 30).length;

      return NextResponse.json({
        workstation_id: workstationId,
        period: { start_date: startDate, end_date: endDate },
        statistics: {
          total_days: totalDays,
          avg_utilization: Math.round(avgUtilization * 100) / 100,
          overloaded_days: overloadedDays,
          idle_days: idleDays,
          optimal_days: totalDays - overloadedDays - idleDays,
        },
        trend: allocations.map(row => ({
          date: row.allocation_date,
          available_minutes: Number(row.available_minutes),
          allocated_minutes: Number(row.allocated_minutes),
          overtime_minutes: Number(row.overtime_minutes),
          utilization_percentage: Number(row.utilization_percentage || 0),
          efficiency_percentage: Number(row.efficiency_percentage),
          load_status: row.load_status,
        })),
      });
    }

    // All workstations summary
    let groupByClause = 'ca.allocation_date';
    if (groupBy === 'week') {
      groupByClause = "DATE_TRUNC('week', ca.allocation_date)";
    } else if (groupBy === 'month') {
      groupByClause = "DATE_TRUNC('month', ca.allocation_date)";
    }

    const result = await query(
      `SELECT 
        w.id as workstation_id,
        w.name as workstation_name,
        w.code as workstation_code,
        COUNT(DISTINCT ca.allocation_date) as days_tracked,
        AVG(ca.utilization_percentage) as avg_utilization,
        MAX(ca.utilization_percentage) as max_utilization,
        MIN(ca.utilization_percentage) as min_utilization,
        SUM(ca.available_minutes) as total_available,
        SUM(ca.allocated_minutes) as total_allocated,
        SUM(ca.overtime_minutes) as total_overtime,
        COUNT(CASE WHEN ca.utilization_percentage >= 100 THEN 1 END) as overloaded_days,
        COUNT(CASE WHEN ca.utilization_percentage < 30 THEN 1 END) as idle_days
       FROM workstations w
       LEFT JOIN capacity_allocations ca ON ca.workstation_id = w.id
         AND ca.allocation_date BETWEEN $1 AND $2
       WHERE w.status = 'active'
       GROUP BY w.id, w.name, w.code
       ORDER BY avg_utilization DESC NULLS LAST`,
      [startDate, endDate]
    );

    // Get top bottlenecks (overloaded workstations)
    const bottlenecks = result.rows
      .filter(row => Number(row.avg_utilization) >= 85)
      .slice(0, 5)
      .map(row => ({
        workstation_id: row.workstation_id,
        workstation_name: row.workstation_name,
        workstation_code: row.workstation_code,
        avg_utilization: Math.round(Number(row.avg_utilization || 0) * 100) / 100,
        overloaded_days: Number(row.overloaded_days),
      }));

    // Get underutilized workstations
    const underutilized = result.rows
      .filter(row => Number(row.avg_utilization) < 40 && Number(row.days_tracked) > 0)
      .slice(0, 5)
      .map(row => ({
        workstation_id: row.workstation_id,
        workstation_name: row.workstation_name,
        workstation_code: row.workstation_code,
        avg_utilization: Math.round(Number(row.avg_utilization || 0) * 100) / 100,
        idle_days: Number(row.idle_days),
      }));

    return NextResponse.json({
      period: { start_date: startDate, end_date: endDate },
      summary: {
        total_workstations: result.rows.length,
        avg_utilization: Math.round(
          result.rows.reduce((sum, row) => sum + Number(row.avg_utilization || 0), 0) / 
          result.rows.length * 100
        ) / 100,
        bottlenecks_count: bottlenecks.length,
        underutilized_count: underutilized.length,
      },
      bottlenecks,
      underutilized,
      workstations: result.rows.map(row => ({
        workstation_id: row.workstation_id,
        workstation_name: row.workstation_name,
        workstation_code: row.workstation_code,
        days_tracked: Number(row.days_tracked),
        avg_utilization: Math.round(Number(row.avg_utilization || 0) * 100) / 100,
        max_utilization: Math.round(Number(row.max_utilization || 0) * 100) / 100,
        min_utilization: Math.round(Number(row.min_utilization || 0) * 100) / 100,
        total_available: Number(row.total_available || 0),
        total_allocated: Number(row.total_allocated || 0),
        total_overtime: Number(row.total_overtime || 0),
        overloaded_days: Number(row.overloaded_days),
        idle_days: Number(row.idle_days),
      })),
    });
  } catch (error: any) {
    console.error('Capacity utilization API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch capacity utilization', details: error.message },
      { status: 500 }
    );
  }
}
