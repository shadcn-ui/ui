import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * GET /api/operations/capacity/conflicts
 * Detect and return capacity conflicts
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const scheduleId = searchParams.get('schedule_id');
    const workstationId = searchParams.get('workstation_id');
    const status = searchParams.get('status') || 'open';
    const severity = searchParams.get('severity'); // high, medium, low

    if (scheduleId) {
      // Get conflicts for a specific schedule using the database function
      const result = await query(
        `SELECT * FROM detect_schedule_conflicts($1)`,
        [scheduleId]
      );

      return NextResponse.json({
        schedule_id: scheduleId,
        conflicts: result.rows.map(row => ({
          conflict_type: row.conflict_type,
          severity: row.severity,
          workstation_id: row.workstation_id,
          affected_date: row.affected_date,
          description: row.description,
        })),
      });
    }

    // Get all conflicts from the database
    let queryText = `
      SELECT 
        sc.id,
        sc.schedule_id,
        ps.schedule_name,
        sc.conflict_type,
        sc.severity,
        sc.workstation_id,
        w.name as workstation_name,
        w.code as workstation_code,
        sc.affected_date,
        sc.affected_assignments,
        sc.conflict_description,
        sc.suggested_resolution,
        sc.status,
        sc.resolved_by,
        sc.resolved_at,
        sc.resolution_notes,
        sc.created_at
      FROM schedule_conflicts sc
      LEFT JOIN production_schedules ps ON ps.id = sc.schedule_id
      LEFT JOIN workstations w ON w.id = sc.workstation_id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 0;

    if (workstationId) {
      paramCount++;
      queryText += ` AND sc.workstation_id = $${paramCount}`;
      params.push(workstationId);
    }

    if (status) {
      paramCount++;
      queryText += ` AND sc.status = $${paramCount}`;
      params.push(status);
    }

    if (severity) {
      paramCount++;
      queryText += ` AND sc.severity = $${paramCount}`;
      params.push(severity);
    }

    queryText += ` ORDER BY 
      CASE sc.severity 
        WHEN 'high' THEN 1 
        WHEN 'medium' THEN 2 
        WHEN 'low' THEN 3 
        ELSE 4 
      END,
      sc.affected_date DESC,
      sc.created_at DESC`;

    const result = await query(queryText, params);

    // Get summary statistics
    const summaryResult = await query(
      `SELECT 
        COUNT(*) as total_conflicts,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_conflicts,
        COUNT(CASE WHEN severity = 'high' THEN 1 END) as high_severity,
        COUNT(CASE WHEN severity = 'medium' THEN 1 END) as medium_severity,
        COUNT(CASE WHEN severity = 'low' THEN 1 END) as low_severity,
        COUNT(CASE WHEN conflict_type = 'capacity_overload' THEN 1 END) as capacity_overloads,
        COUNT(CASE WHEN conflict_type = 'resource_conflict' THEN 1 END) as resource_conflicts,
        COUNT(CASE WHEN conflict_type = 'dependency_violation' THEN 1 END) as dependency_violations
       FROM schedule_conflicts
       WHERE status = 'open'`
    );

    const summary = summaryResult.rows[0];

    return NextResponse.json({
      summary: {
        total_conflicts: Number(summary.total_conflicts),
        open_conflicts: Number(summary.open_conflicts),
        high_severity: Number(summary.high_severity),
        medium_severity: Number(summary.medium_severity),
        low_severity: Number(summary.low_severity),
        by_type: {
          capacity_overload: Number(summary.capacity_overloads),
          resource_conflict: Number(summary.resource_conflicts),
          dependency_violation: Number(summary.dependency_violations),
        },
      },
      conflicts: result.rows.map(row => ({
        id: row.id,
        schedule: {
          id: row.schedule_id,
          name: row.schedule_name,
        },
        conflict_type: row.conflict_type,
        severity: row.severity,
        workstation: row.workstation_id ? {
          id: row.workstation_id,
          name: row.workstation_name,
          code: row.workstation_code,
        } : null,
        affected_date: row.affected_date,
        affected_assignments: row.affected_assignments,
        description: row.conflict_description,
        suggested_resolution: row.suggested_resolution,
        status: row.status,
        resolved_by: row.resolved_by,
        resolved_at: row.resolved_at,
        resolution_notes: row.resolution_notes,
        created_at: row.created_at,
      })),
    });
  } catch (error: any) {
    console.error('Capacity conflicts API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch capacity conflicts', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/operations/capacity/conflicts/[id]
 * Resolve a conflict
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { conflict_id, resolution_notes, resolved_by } = body;

    if (!conflict_id) {
      return NextResponse.json(
        { error: 'Missing required field: conflict_id' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE schedule_conflicts
       SET status = 'resolved',
           resolved_by = $1,
           resolved_at = CURRENT_TIMESTAMP,
           resolution_notes = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, status, resolved_at, resolution_notes`,
      [resolved_by, resolution_notes, conflict_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Conflict not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Conflict resolved successfully',
      conflict: {
        id: result.rows[0].id,
        status: result.rows[0].status,
        resolved_at: result.rows[0].resolved_at,
        resolution_notes: result.rows[0].resolution_notes,
      },
    });
  } catch (error: any) {
    console.error('Capacity conflicts PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to resolve conflict', details: error.message },
      { status: 500 }
    );
  }
}
