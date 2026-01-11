import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { pool } from '@/lib/db'
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

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `profile-${userId}-${timestamp}.${extension}`
    
    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars')
    await mkdir(uploadDir, { recursive: true })
    
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)
    
    // Update database with new profile picture URL
    const profilePictureUrl = `/uploads/avatars/${filename}`
    const client = await pool.connect()
    
    try {
      await client.query(
        'UPDATE users SET profile_picture_url = $1, updated_at = NOW() WHERE id = $2',
        [profilePictureUrl, userId]
      )
      
      return NextResponse.json({
        success: true,
        data: { profile_picture_url: profilePictureUrl },
        message: 'Profile picture updated successfully'
      })
    } finally {
      client.release()
    }

  } catch (error: any) {
    console.error('Error uploading profile picture:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload profile picture', details: error.message },
      { status: 500 }
    )
  }
}
