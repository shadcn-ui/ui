import { NextResponse } from 'next/server'
import { loadJournalTrace } from '@/lib/trace'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const identifier = decodeURIComponent(params.id)
    const result = await loadJournalTrace(identifier)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Trace journal API error:', error)
    return NextResponse.json({ success: false, error: 'Failed to load journal trace' }, { status: 500 })
  }
}
