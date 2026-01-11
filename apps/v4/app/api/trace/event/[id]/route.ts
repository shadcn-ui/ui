import { NextResponse } from 'next/server'
import { loadEventTrace } from '@/lib/trace'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = decodeURIComponent(params.id)
    const result = await loadEventTrace(eventId)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Trace event API error:', error)
    return NextResponse.json({ success: false, error: 'Failed to load event trace' }, { status: 500 })
  }
}
