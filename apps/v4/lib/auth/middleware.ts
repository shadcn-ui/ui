import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  email_verified: boolean;
  roles: Array<{
    id: string;
    name: string;
    display_name: string;
  }>;
  permissions: Array<{
    id: string;
    module: string;
    resource: string;
    action: string;
  }>;
}

/**
 * Get current authenticated user from session token
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  const client = await pool.connect();
  
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      return null;
    }

    // Get session and user
    const sessionResult = await client.query(
      `SELECT s.*, u.id as user_id, u.email, u.first_name, u.last_name, u.is_active, u.email_verified
       FROM user_sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.session_token = $1 AND s.expires_at > NOW()`,
      [sessionToken]
    );

    if (sessionResult.rows.length === 0) {
      return null;
    }

    const session = sessionResult.rows[0];

    // Update last activity
    await client.query(
      'UPDATE user_sessions SET last_activity = NOW() WHERE session_token = $1',
      [sessionToken]
    );

    // Get user roles
    const rolesResult = await client.query(
      `SELECT r.id, r.name, r.display_name
       FROM roles r
       JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = $1`,
      [session.user_id]
    );

    // Get user permissions
    const permissionsResult = await client.query(
      `SELECT DISTINCT p.id, p.module, p.resource, p.action
       FROM permissions p
       JOIN role_permissions rp ON p.id = rp.permission_id
       JOIN user_roles ur ON rp.role_id = ur.role_id
       WHERE ur.user_id = $1`,
      [session.user_id]
    );

    return {
      id: session.user_id,
      email: session.email,
      first_name: session.first_name,
      last_name: session.last_name,
      is_active: session.is_active,
      email_verified: session.email_verified,
      roles: rolesResult.rows,
      permissions: permissionsResult.rows,
    };

  } catch (error) {
    console.error('Get auth user error:', error);
    return null;
  } finally {
    client.release();
  }
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: AuthUser, resource: string, action: string): boolean {
  return user.permissions.some(
    (p) => p.resource === resource && p.action === action
  );
}

/**
 * Check if user has any of the specified roles
 */
export function hasRole(user: AuthUser, ...roleNames: string[]): boolean {
  return user.roles.some((r) => roleNames.includes(r.name));
}

/**
 * Middleware to require authentication
 */
export async function requireAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>
): Promise<NextResponse> {
  const user = await getAuthUser(request);

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized. Please login.' },
      { status: 401 }
    );
  }

  if (!user.is_active) {
    return NextResponse.json(
      { error: 'Account is deactivated.' },
      { status: 403 }
    );
  }

  return handler(request, user);
}

/**
 * Middleware to require specific permission
 */
export async function requirePermission(
  request: NextRequest,
  resource: string,
  action: string,
  handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>
): Promise<NextResponse> {
  return requireAuth(request, async (req, user) => {
    if (!hasPermission(user, resource, action)) {
      return NextResponse.json(
        { error: `Permission denied. Required: ${resource}:${action}` },
        { status: 403 }
      );
    }

    return handler(req, user);
  });
}

/**
 * Middleware to require specific role
 */
export async function requireRole(
  request: NextRequest,
  roleNames: string[],
  handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>
): Promise<NextResponse> {
  return requireAuth(request, async (req, user) => {
    if (!hasRole(user, ...roleNames)) {
      return NextResponse.json(
        { error: `Access denied. Required roles: ${roleNames.join(', ')}` },
        { status: 403 }
      );
    }

    return handler(req, user);
  });
}
