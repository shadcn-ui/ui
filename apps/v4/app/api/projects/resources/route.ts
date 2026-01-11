import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/projects/resources - List resources
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const resource_type = searchParams.get('resource_type');
    const is_available = searchParams.get('is_available');
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    let conditions: string[] = ['is_active = TRUE'];
    let params: any[] = [];
    let paramIndex = 1;

    if (resource_type) {
      conditions.push(`resource_type = $${paramIndex++}`);
      params.push(resource_type);
    }

    if (is_available !== null && is_available !== undefined) {
      conditions.push(`is_available = $${paramIndex++}`);
      params.push(is_available === 'true');
    }

    if (role) {
      conditions.push(`role ILIKE $${paramIndex++}`);
      params.push(`%${role}%`);
    }

    if (search) {
      conditions.push(`(resource_name ILIKE $${paramIndex} OR resource_code ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const result = await query(
      `SELECT 
        r.*,
        (SELECT COUNT(*) FROM project_resource_allocations 
         WHERE resource_id = r.resource_id AND allocation_status = 'active') as active_allocations,
        (SELECT SUM(allocated_hours) FROM project_resource_allocations 
         WHERE resource_id = r.resource_id AND allocation_status = 'active') as total_allocated_hours
       FROM project_resources r
       ${whereClause}
       ORDER BY resource_name`,
      params
    );

    return NextResponse.json({ resources: result.rows });

  } catch (error: any) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/projects/resources - Create resource
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      resource_type, resource_name, resource_code, user_id, role, skill_set,
      is_available = true, daily_capacity_hours = 8, weekly_capacity_hours = 40,
      cost_per_hour, billing_rate_per_hour, location, timezone
    } = body;

    if (!resource_type || !resource_name) {
      return NextResponse.json(
        { error: 'Missing required fields: resource_type, resource_name' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO project_resources (
        resource_type, resource_name, resource_code, user_id, role, skill_set,
        is_available, daily_capacity_hours, weekly_capacity_hours,
        cost_per_hour, billing_rate_per_hour, location, timezone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [resource_type, resource_name, resource_code, user_id, role, skill_set,
       is_available, daily_capacity_hours, weekly_capacity_hours,
       cost_per_hour, billing_rate_per_hour, location, timezone]
    );

    return NextResponse.json({
      message: 'Resource created successfully',
      resource: result.rows[0]
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource', details: error.message },
      { status: 500 }
    );
  }
}
