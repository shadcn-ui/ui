import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session_token')?.value

  if (!sessionToken) return null

  const client = await pool.connect()
  try {
    const result = await client.query(
      `SELECT user_id FROM user_sessions WHERE session_token = $1 AND expires_at > NOW()`,
      [sessionToken]
    )
    return result.rows[0]?.user_id || null
  } finally {
    client.release()
  }
}

// GET - Get current user profile
export async function GET(request: Request) {
  try {
    const userId = await getCurrentUserId()
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const client = await pool.connect()
    
    try {
      const result = await client.query(
        `SELECT 
          id,
          first_name,
          last_name,
          email,
          phone,
          profile_picture_url,
          created_at,
          last_login
        FROM users
        WHERE id = $1`,
        [userId]
      )

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0]
      })
      
    } finally {
      client.release()
    }

  } catch (error: any) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile', details: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update user profile
export async function PUT(request: Request) {
  try {
    const userId = await getCurrentUserId()
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { firstName, lastName, phone, currentPassword, newPassword } = body

    // Validation
    if (!firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'First name and last name are required' },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')

      // If changing password, verify current password
      if (newPassword) {
        if (!currentPassword) {
          return NextResponse.json(
            { success: false, error: 'Current password is required to change password' },
            { status: 400 }
          )
        }

        if (newPassword.length < 8) {
          return NextResponse.json(
            { success: false, error: 'New password must be at least 8 characters' },
            { status: 400 }
          )
        }

        // Verify current password
        const userResult = await client.query(
          'SELECT password_hash FROM users WHERE id = $1',
          [userId]
        )

        const isValidPassword = await bcrypt.compare(
          currentPassword,
          userResult.rows[0].password_hash
        )

        if (!isValidPassword) {
          return NextResponse.json(
            { success: false, error: 'Current password is incorrect' },
            { status: 400 }
          )
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Update password
        await client.query(
          'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
          [hashedPassword, userId]
        )

        // Clear all sessions except current one (force re-login on other devices)
        const cookieStore = await cookies()
        const sessionToken = cookieStore.get('session_token')?.value
        await client.query(
          'DELETE FROM user_sessions WHERE user_id = $1 AND session_token != $2',
          [userId, sessionToken]
        )
      }

      // Update profile
      const result = await client.query(
        `UPDATE users SET
          first_name = $1,
          last_name = $2,
          phone = $3,
          updated_at = NOW()
        WHERE id = $4
        RETURNING 
          id,
          first_name,
          last_name,
          email,
          phone,
          profile_picture_url,
          created_at,
          last_login`,
        [firstName, lastName, phone || null, userId]
      )

      await client.query('COMMIT')

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: newPassword ? 'Profile and password updated successfully' : 'Profile updated successfully'
      })
      
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }

  } catch (error: any) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile', details: error.message },
      { status: 500 }
    )
  }
}
