import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// GET - Get user roles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    
    try {
      // Get user's current roles
      const result = await client.query(
        `SELECT 
          r.id,
          r.name,
          r.display_name,
          r.description,
          ur.assigned_at
        FROM roles r
        JOIN user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = $1
        ORDER BY r.display_name`,
        [userId]
      )

      // Get all available roles
      const allRolesResult = await client.query(
        `SELECT 
          id,
          name,
          display_name,
          description
        FROM roles
        ORDER BY display_name`
      )

      return NextResponse.json({
        success: true,
        data: {
          userRoles: result.rows,
          allRoles: allRolesResult.rows
        }
      })
      
    } finally {
      client.release()
    }

  } catch (error: any) {
    console.error('Error fetching user roles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user roles', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Assign roles to user
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, roleIds } = body

    // Validation
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (!roleIds || !Array.isArray(roleIds)) {
      return NextResponse.json(
        { success: false, error: 'Role IDs must be an array' },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    
    try {
      // Check if user exists
      const userCheck = await client.query(
        'SELECT id, email FROM users WHERE id = $1',
        [userId]
      )
      
      if (userCheck.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        )
      }

      await client.query('BEGIN')

      // Remove all existing roles
      await client.query(
        'DELETE FROM user_roles WHERE user_id = $1',
        [userId]
      )

      // Add new roles
      if (roleIds.length > 0) {
        const values = roleIds.map((roleId, index) => 
          `($1, $${index + 2}, NOW(), $1)`
        ).join(', ')
        
        const params = [userId, ...roleIds]
        
        await client.query(
          `INSERT INTO user_roles (user_id, role_id, assigned_at, assigned_by)
           VALUES ${values}`,
          params
        )
      }

      // Delete user's sessions to force re-login with new permissions
      await client.query(
        'DELETE FROM user_sessions WHERE user_id = $1',
        [userId]
      )

      await client.query('COMMIT')

      // Get updated roles
      const result = await client.query(
        `SELECT 
          r.id,
          r.name,
          r.display_name,
          COUNT(DISTINCT p.id) as permission_count
        FROM roles r
        JOIN user_roles ur ON r.id = ur.role_id
        LEFT JOIN role_permissions rp ON r.id = rp.role_id
        LEFT JOIN permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = $1
        GROUP BY r.id, r.name, r.display_name
        ORDER BY r.display_name`,
        [userId]
      )

      return NextResponse.json({
        success: true,
        data: result.rows,
        message: 'User roles updated successfully'
      })
      
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }

  } catch (error: any) {
    console.error('Error updating user roles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user roles', details: error.message },
      { status: 500 }
    )
  }
}
