import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.DB_USER || 'mac',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ocean-erp',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const quotationId = Number(id)
  try {
    const body = await request.json()
    const to = body.to
    if (!to) return NextResponse.json({ error: 'Missing recipient' }, { status: 400 })

    // Get HTML from the export endpoint
    const exportRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000'}/api/quotations/${quotationId}/export`)
    const html = await exportRes.text()

    // Try to send using nodemailer if available
    try {
      const nodemailer = await import('nodemailer')
      // Create transporter from env (if configured)
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      })
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@example.com',
        to,
        subject: body.subject || `Quotation ${id}`,
        html,
      })
      return NextResponse.json({ message: 'Email sent', info })
    } catch (err) {
      console.warn('nodemailer not available or failed to send:', err)
      // Fallback: just log and return success with note
      console.log(`Simulated send to ${to} of quotation ${id}`)
      return NextResponse.json({ message: 'Simulated send (nodemailer not configured)' })
    }
  } catch (error) {
    console.error('Send error', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
