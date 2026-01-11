import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { hashPassword, isValidPassword } from '@/lib/auth/utils';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: 'Password does not meet requirements', details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Check if token is valid
    const tokenResult = await client.query(
      `SELECT prt.user_id, prt.expires_at, u.email
       FROM password_reset_tokens prt
       JOIN users u ON prt.user_id = u.id
       WHERE prt.token = $1 AND prt.used = false AND prt.expires_at > NOW()`,
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    const { user_id } = tokenResult.rows[0];

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Start transaction
    await client.query('BEGIN');

    // Update user password
    await client.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, user_id]
    );

    // Mark token as used
    await client.query(
      'UPDATE password_reset_tokens SET used = true, used_at = NOW() WHERE token = $1',
      [token]
    );

    // Invalidate all existing sessions for this user
    await client.query(
      'DELETE FROM user_sessions WHERE user_id = $1',
      [user_id]
    );

    await client.query('COMMIT');

    return NextResponse.json({
      message: 'Password reset successfully. Please login with your new password.'
    }, { status: 200 });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
