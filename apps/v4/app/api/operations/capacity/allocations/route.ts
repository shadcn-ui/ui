import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * GET /api/operations/capacity/allocations
 * Get capacity allocations with filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workstationId = searchParams.get('workstation_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const minUtilization = searchParams.get('min_utilization');

    let queryText = `
      SELECT 
        ca.id,
        ca.workstation_id,
        w.name as workstation_name,
        w.code as workstation_code,
        ca.allocation_date,
        ca.shift_name,
        ca.available_minutes,
        ca.allocated_minutes,
        ca.overtime_minutes,
        ca.efficiency_percentage,
        ca.utilization_percentage,
        ca.notes,
        ca.created_at
      FROM capacity_allocations ca
      JOIN workstations w ON w.id = ca.workstation_id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 0;

    if (workstationId) {
      paramCount++;
      queryText += ` AND ca.workstation_id = $${paramCount}`;
      params.push(workstationId);
    }

    if (startDate) {
      paramCount++;
      queryText += ` AND ca.allocation_date >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      queryText += ` AND ca.allocation_date <= $${paramCount}`;
      params.push(endDate);
    }

    if (minUtilization) {
      paramCount++;
      queryText += ` AND ca.utilization_percentage >= $${paramCount}`;
      params.push(minUtilization);
    }

    queryText += ` ORDER BY ca.allocation_date DESC, w.name`;

    const result = await query(queryText, params);

    return NextResponse.json({
      allocations: result.rows.map(row => ({
        id: row.id,
        workstation: {
          id: row.workstation_id,
          name: row.workstation_name,
          code: row.workstation_code,
        },
        date: row.allocation_date,
        shift_name: row.shift_name,
        available_minutes: Number(row.available_minutes),
        allocated_minutes: Number(row.allocated_minutes),
        overtime_minutes: Number(row.overtime_minutes),
        efficiency_percentage: Number(row.efficiency_percentage),
        utilization_percentage: Number(row.utilization_percentage || 0),
        notes: row.notes,
        created_at: row.created_at,
      })),
    });
  } catch (error: any) {
    console.error('Capacity allocations GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch capacity allocations', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/operations/capacity/allocations
 * Create or update capacity allocation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      workstation_id,
      allocation_date,
      shift_name,
      available_minutes,
      allocated_minutes,
      overtime_minutes,
      efficiency_percentage,
      notes,
    } = body;

    // Validate required fields
    if (!workstation_id || !allocation_date || !available_minutes) {
      return NextResponse.json(
        { error: 'Missing required fields: workstation_id, allocation_date, available_minutes' },
        { status: 400 }
      );
    }

    // Check if allocation already exists
    const existing = await query(
      `SELECT id FROM capacity_allocations 
       WHERE workstation_id = $1 AND allocation_date = $2 AND COALESCE(shift_name, '') = COALESCE($3, '')`,
      [workstation_id, allocation_date, shift_name]
    );

    if (existing.rows.length > 0) {
      // Update existing
      const result = await query(
        `UPDATE capacity_allocations
         SET available_minutes = $1,
             allocated_minutes = $2,
             overtime_minutes = $3,
             efficiency_percentage = $4,
             notes = $5,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING id, workstation_id, allocation_date, shift_name, 
                   available_minutes, allocated_minutes, overtime_minutes,
                   efficiency_percentage, utilization_percentage, notes`,
        [
          available_minutes,
          allocated_minutes || 0,
          overtime_minutes || 0,
          efficiency_percentage || 100,
          notes,
          existing.rows[0].id,
        ]
      );

      return NextResponse.json({
        message: 'Capacity allocation updated',
        allocation: {
          id: result.rows[0].id,
          workstation_id: result.rows[0].workstation_id,
          date: result.rows[0].allocation_date,
          shift_name: result.rows[0].shift_name,
          available_minutes: Number(result.rows[0].available_minutes),
          allocated_minutes: Number(result.rows[0].allocated_minutes),
          overtime_minutes: Number(result.rows[0].overtime_minutes),
          efficiency_percentage: Number(result.rows[0].efficiency_percentage),
          utilization_percentage: Number(result.rows[0].utilization_percentage || 0),
          notes: result.rows[0].notes,
        },
      });
    }

    // Create new allocation
    const result = await query(
      `INSERT INTO capacity_allocations (
        workstation_id, allocation_date, shift_name, available_minutes,
        allocated_minutes, overtime_minutes, efficiency_percentage, notes
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, workstation_id, allocation_date, shift_name,
                 available_minutes, allocated_minutes, overtime_minutes,
                 efficiency_percentage, utilization_percentage, notes`,
      [
        workstation_id,
        allocation_date,
        shift_name,
        available_minutes,
        allocated_minutes || 0,
        overtime_minutes || 0,
        efficiency_percentage || 100,
        notes,
      ]
    );

    return NextResponse.json(
      {
        message: 'Capacity allocation created',
        allocation: {
          id: result.rows[0].id,
          workstation_id: result.rows[0].workstation_id,
          date: result.rows[0].allocation_date,
          shift_name: result.rows[0].shift_name,
          available_minutes: Number(result.rows[0].available_minutes),
          allocated_minutes: Number(result.rows[0].allocated_minutes),
          overtime_minutes: Number(result.rows[0].overtime_minutes),
          efficiency_percentage: Number(result.rows[0].efficiency_percentage),
          utilization_percentage: Number(result.rows[0].utilization_percentage || 0),
          notes: result.rows[0].notes,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Capacity allocations POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create capacity allocation', details: error.message },
      { status: 500 }
    );
  }
}
