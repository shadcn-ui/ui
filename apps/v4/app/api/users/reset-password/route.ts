import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// POST - Reset user password
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, newPassword } = body

    // Validation
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (!newPassword) {
      return NextResponse.json(
        { success: false, error: 'New password is required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    
    try {
      // Check if user exists
      const userCheck = await client.query(
        'SELECT id, email, first_name, last_name FROM users WHERE id = $1',
        [userId]
      )
      
      if (userCheck.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        )
      }

      const user = userCheck.rows[0]

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      // Update user's password
      await client.query(
        `UPDATE users SET
          password_hash = $1,
          updated_at = NOW()
        WHERE id = $2`,
        [hashedPassword, userId]
      )

      // Invalidate all existing sessions for this user
      await client.query(
        'DELETE FROM user_sessions WHERE user_id = $1',
        [userId]
      )

      // Log password reset
      console.log(`Password reset for ${user.email} by admin`)

      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: `${user.first_name} ${user.last_name}`
          }
        },
        message: 'Password reset successfully'
      })
      
    } finally {
      client.release()
    }

  } catch (error: any) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reset password', details: error.message },
      { status: 500 }
    )
  }
}
