import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { hashPassword, generateToken, isValidPassword } from '@/lib/auth/utils';

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
    const { email, password, first_name, last_name } = body;

    // Validation
    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, first_name, last_name' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
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

    // Check if user already exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate email verification token
    const verificationToken = generateToken();
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24); // 24 hours expiry

    // Start transaction
    await client.query('BEGIN');

    // Insert user
    const insertUserResult = await client.query(
      `INSERT INTO users 
        (email, password_hash, first_name, last_name, is_active, email_verified, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, true, false, NOW(), NOW()) 
       RETURNING id, email, first_name, last_name, created_at`,
      [email.toLowerCase(), hashedPassword, first_name, last_name]
    );

    const user = insertUserResult.rows[0];

    // Assign default role (viewer) to new user
    const viewerRole = await client.query(
      'SELECT id FROM roles WHERE name = $1',
      ['viewer']
    );

    if (viewerRole.rows.length > 0) {
      await client.query(
        'INSERT INTO user_roles (user_id, role_id, assigned_at, assigned_by) VALUES ($1, $2, NOW(), $1)',
        [user.id, viewerRole.rows[0].id]
      );
    }

    // Create email verification token
    await client.query(
      `INSERT INTO email_verification_tokens 
        (user_id, token, expires_at, created_at) 
       VALUES ($1, $2, $3, NOW())`,
      [user.id, verificationToken, tokenExpiry]
    );

    await client.query('COMMIT');

    // In production, send verification email here
    // For now, return the token in response (remove this in production)
    
    return NextResponse.json({
      message: 'User registered successfully. Please verify your email.',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: user.created_at,
      },
      // Remove this in production - only for development
      verification_token: verificationToken,
    }, { status: 201 });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
