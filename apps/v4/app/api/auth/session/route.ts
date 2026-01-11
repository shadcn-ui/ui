import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { cookies } from 'next/headers';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export async function GET() {
  const client = await pool.connect();
  
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 401 }
      );
    }

    // Get session and check if valid
    const sessionResult = await client.query(
      `SELECT s.*, u.id as user_id, u.email, u.first_name, u.last_name, u.is_active, u.email_verified
       FROM user_sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.session_token = $1 AND s.expires_at > NOW()`,
      [sessionToken]
    );

    if (sessionResult.rows.length === 0) {
      const response = NextResponse.json(
        { error: 'Session expired or invalid' },
        { status: 401 }
      );
      response.cookies.delete('session_token');
      return response;
    }

    const session = sessionResult.rows[0];

    // Update last activity
    await client.query(
      'UPDATE user_sessions SET last_activity = NOW() WHERE session_token = $1',
      [sessionToken]
    );

    // Get user roles
    const rolesResult = await client.query(
      `SELECT r.id, r.name, r.display_name, r.description
       FROM roles r
       JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = $1`,
      [session.user_id]
    );

    // Get user permissions
    const permissionsResult = await client.query(
      `SELECT DISTINCT p.id, p.module, p.resource, p.action, p.description
       FROM permissions p
       JOIN role_permissions rp ON p.id = rp.permission_id
       JOIN user_roles ur ON rp.role_id = ur.role_id
       WHERE ur.user_id = $1`,
      [session.user_id]
    );

    return NextResponse.json({
      user: {
        id: session.user_id,
        email: session.email,
        first_name: session.first_name,
        last_name: session.last_name,
        is_active: session.is_active,
        email_verified: session.email_verified,
        roles: rolesResult.rows,
        permissions: permissionsResult.rows,
      },
      session: {
        expires_at: session.expires_at,
        last_activity: session.last_activity,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'Failed to get session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
