import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { verifyPassword, generateToken } from '@/lib/auth/utils';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 30;

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user
    const userResult = await client.query(
      `SELECT id, email, password_hash, first_name, last_name, is_active, 
              email_verified, failed_login_attempts, account_locked_until
       FROM users 
       WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // Check if account is locked
    if (user.account_locked_until && new Date(user.account_locked_until) > new Date()) {
      const minutesRemaining = Math.ceil((new Date(user.account_locked_until).getTime() - new Date().getTime()) / 60000);
      return NextResponse.json(
        { error: `Account is locked. Try again in ${minutesRemaining} minutes.` },
        { status: 423 }
      );
    }

    // Check if account is active
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Account is deactivated. Please contact administrator.' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      // Increment failed login attempts
      const newFailedAttempts = (user.failed_login_attempts || 0) + 1;
      
      let lockUntil = null;
      if (newFailedAttempts >= MAX_LOGIN_ATTEMPTS) {
        lockUntil = new Date();
        lockUntil.setMinutes(lockUntil.getMinutes() + LOCKOUT_DURATION_MINUTES);
      }

      await client.query(
        `UPDATE users 
         SET failed_login_attempts = $1, account_locked_until = $2, updated_at = NOW()
         WHERE id = $3`,
        [newFailedAttempts, lockUntil, user.id]
      );

      // Log failed attempt
      await client.query(
        `INSERT INTO login_attempts 
          (email, ip_address, success, attempted_at)
         VALUES ($1, $2, false, NOW())`,
        [user.email, request.headers.get('x-forwarded-for') || 'unknown']
      );

      if (lockUntil) {
        return NextResponse.json(
          { error: `Account locked due to multiple failed login attempts. Try again in ${LOCKOUT_DURATION_MINUTES} minutes.` },
          { status: 423 }
        );
      }

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check email verification
    if (!user.email_verified) {
      return NextResponse.json(
        { error: 'Please verify your email before logging in' },
        { status: 403 }
      );
    }

    // Start transaction
    await client.query('BEGIN');

    // Reset failed login attempts
    await client.query(
      `UPDATE users 
       SET failed_login_attempts = 0, account_locked_until = NULL, last_login = NOW(), updated_at = NOW()
       WHERE id = $1`,
      [user.id]
    );

    // Log successful attempt
    await client.query(
      `INSERT INTO login_attempts 
        (email, ip_address, success, attempted_at)
       VALUES ($1, $2, true, NOW())`,
      [user.email, request.headers.get('x-forwarded-for') || 'unknown']
    );

    // Create session
    const sessionToken = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days session

    await client.query(
      `INSERT INTO user_sessions 
        (user_id, session_token, ip_address, user_agent, expires_at, created_at, last_activity)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [user.id, sessionToken, request.headers.get('x-forwarded-for') || 'unknown', request.headers.get('user-agent') || 'unknown', expiresAt]
    );

    // Get user roles and permissions
    const rolesResult = await client.query(
      `SELECT r.id, r.name, r.description
       FROM roles r
       JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = $1`,
      [user.id]
    );

    const permissionsResult = await client.query(
      `SELECT DISTINCT p.id, p.module, p.resource, p.action, p.description
       FROM permissions p
       JOIN role_permissions rp ON p.id = rp.permission_id
       JOIN user_roles ur ON rp.role_id = ur.role_id
       WHERE ur.user_id = $1`,
      [user.id]
    );

    await client.query('COMMIT');

    // Set session cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        roles: rolesResult.rows,
        permissions: permissionsResult.rows,
      }
    }, { status: 200 });

    // Set httpOnly cookie with session token
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    });

    return response;

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
