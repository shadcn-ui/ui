import { NextResponse } from 'next/server'
import { loadOrderTrace } from '@/lib/trace'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const identifier = decodeURIComponent(params.id)
    const result = await loadOrderTrace(identifier)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Trace order API error:', error)
    return NextResponse.json({ success: false, error: 'Failed to load order trace' }, { status: 500 })
  }
}
