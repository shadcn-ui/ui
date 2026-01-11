import { NextRequest, NextResponse } from 'next/server'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'

const MAX_SIZE_BYTES = 500 * 1024 // 500KB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only PNG, JPG, or SVG are allowed.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 500KB.' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const extension = file.name.split('.').pop() || 'png'
    const filename = `company-logo-${Date.now()}.${extension}`

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'company')
    await mkdir(uploadDir, { recursive: true })

    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    const publicUrl = `/uploads/company/${filename}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      message: 'Logo uploaded successfully'
    })
  } catch (error: any) {
    console.error('Error uploading company logo:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload logo', details: error?.message },
      { status: 500 }
    )
  }
}
