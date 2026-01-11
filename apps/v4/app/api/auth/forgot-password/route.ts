import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { generateToken } from '@/lib/auth/utils';

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
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const userResult = await client.query(
      'SELECT id, email, first_name FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    // Always return success message to prevent email enumeration
    if (userResult.rows.length === 0) {
      return NextResponse.json({
        message: 'If a user with this email exists, a password reset link has been sent.'
      }, { status: 200 });
    }

    const user = userResult.rows[0];

    // Generate password reset token
    const resetToken = generateToken();
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1); // 1 hour expiry

    // Start transaction
    await client.query('BEGIN');

    // Delete any existing reset tokens for this user
    await client.query(
      'DELETE FROM password_reset_tokens WHERE user_id = $1',
      [user.id]
    );

    // Insert new reset token
    await client.query(
      `INSERT INTO password_reset_tokens 
        (user_id, token, expires_at, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [user.id, resetToken, tokenExpiry]
    );

    await client.query('COMMIT');

    // In production, send reset email here
    // For now, return the token in response (remove this in production)
    
    return NextResponse.json({
      message: 'If a user with this email exists, a password reset link has been sent.',
      // Remove this in production - only for development
      reset_token: resetToken,
      reset_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000'}/reset-password/${resetToken}`
    }, { status: 200 });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
