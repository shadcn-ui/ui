import { NextRequest, NextResponse } from 'next/server'
import { listIssues, buildTracePath } from '@/lib/issues'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const period_id = searchParams.get('period_id')
  const error_code = searchParams.get('error_code')
  const type = searchParams.get('type')
  const status = searchParams.get('status')

  try {
    const issues = await listIssues({
      period_id,
      error_code: error_code as any,
      type: type as any,
      status: status as any,
    })

    const payload = issues.map((issue) => ({
      ...issue,
      trace_path:
        (issue as any).metadata?.trace_path ||
        buildTracePath((issue as any).metadata?.trace, {
          type: issue.type,
          reference_id: issue.reference_id,
        }),
    }))

    return NextResponse.json({ success: true, issues: payload })
  } catch (error) {
    console.error('Issues API error:', error)
    return NextResponse.json(
      {
        success: false,
        error_code: 'SERVER_ERROR',
        human_message: 'Unable to load issues right now',
        suggested_next_action: 'Retry in a moment or contact support if this persists.',
      },
      { status: 500 }
    )
  }
}
