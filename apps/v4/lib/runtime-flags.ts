import { NextRequest, NextResponse } from 'next/server'
import { buildErrorEnvelope } from '@/lib/errors/standard-error'

// Read once at module load and fail closed (default to true) if missing or unreadable.
const rawFlag = (() => {
  try {
    const value = process.env.OCEAN_PRODUCTION_MODE ?? process.env.NEXT_PUBLIC_OCEAN_PRODUCTION_MODE
    if (value === undefined || value === null) return 'true'
    return value.toString().trim().toLowerCase()
  } catch (err) {
    return 'true'
  }
})()

export const OCEAN_PRODUCTION_MODE = rawFlag === 'true' || rawFlag === '1' || rawFlag === 'yes'

// Stable string for client-side rendering of the banner.
export const OCEAN_PRODUCTION_BANNER = 'OCEAN ERP RUNNING IN PRODUCTION MODE'

export function denyDevOnly(feature: string) {
  if (!OCEAN_PRODUCTION_MODE) return null

  return NextResponse.json(
    buildErrorEnvelope({
      error_code: 'PRODUCTION_MODE_LOCK',
      human_message: `${feature} is disabled because OCEAN_PRODUCTION_MODE is enabled.`,
      suggested_next_action: 'Use production-safe paths only; disable the flag in non-production environments.',
      trace_path: null,
      reference: { order_id: 'production-mode' },
    }),
    { status: 403 }
  )
}

export function blockAdminOverride(request: NextRequest) {
  if (!OCEAN_PRODUCTION_MODE) return null

  const adminHeader = request.headers.get('x-admin-override')?.toLowerCase() === 'true'
  const adminQuery = request.nextUrl.searchParams.get('admin_override')?.toLowerCase() === 'true'

  if (adminHeader || adminQuery) {
    return NextResponse.json(
      buildErrorEnvelope({
        error_code: 'PRODUCTION_MODE_LOCK',
        human_message: 'Admin overrides are disabled when OCEAN_PRODUCTION_MODE is enabled.',
        suggested_next_action: 'Proceed through the standard approval workflow without overrides.',
        trace_path: null,
        reference: { order_id: 'admin-override' },
      }),
      { status: 403 }
    )
  }

  return null
}

export function requireIssueTrail(request: NextRequest, action: string) {
  if (!OCEAN_PRODUCTION_MODE) {
    return { ok: true, issueId: null as string | null }
  }

  const issueId =
    request.headers.get('x-issue-id') ||
    request.headers.get('x-issue-trace') ||
    request.nextUrl.searchParams.get('issue_id')

  if (issueId) {
    return { ok: true, issueId }
  }

  return {
    ok: false,
    issueId: null as string | null,
    response: NextResponse.json(
      buildErrorEnvelope({
        error_code: 'PRODUCTION_MODE_LOCK',
        human_message: `${action} blocked because OCEAN_PRODUCTION_MODE requires an issue trail.`,
        suggested_next_action:
          'Open or reference an issue, then include its identifier in the x-issue-id header or issue_id query parameter.',
        trace_path: null,
        reference: { order_id: 'issue-trail' },
      }),
      { status: 428 }
    ),
  }
}

export function productionLockResponse(feature: string, reference?: { period_id?: string; journal_id?: string; inventory_close_id?: string; order_id?: string }) {
  if (!OCEAN_PRODUCTION_MODE) return null

  const envelope = buildErrorEnvelope({
    error_code: 'PRODUCTION_MODE_LOCK',
    human_message: `${feature} is disabled in production mode.`,
    suggested_next_action: 'Use approved production workflows only; disable OCEAN_PRODUCTION_MODE in non-production.',
    trace_path: null,
    reference: reference || {},
  })

  return NextResponse.json(envelope, { status: 403 })
}
