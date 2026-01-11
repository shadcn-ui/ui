import { NextResponse } from 'next/server';
import { Pool } from 'pg';

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
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Check if token is valid
    const tokenResult = await client.query(
      `SELECT evt.user_id, evt.expires_at
       FROM email_verification_tokens evt
       WHERE evt.token = $1 AND evt.verified = false AND evt.expires_at > NOW()`,
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    const { user_id } = tokenResult.rows[0];

    // Start transaction
    await client.query('BEGIN');

    // Update user email_verified status
    await client.query(
      'UPDATE users SET email_verified = true, updated_at = NOW() WHERE id = $1',
      [user_id]
    );

    // Mark token as verified
    await client.query(
      'UPDATE email_verification_tokens SET verified = true, verified_at = NOW() WHERE token = $1',
      [token]
    );

    await client.query('COMMIT');

    return NextResponse.json({
      message: 'Email verified successfully. You can now login.'
    }, { status: 200 });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
