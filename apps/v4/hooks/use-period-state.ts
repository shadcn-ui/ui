import * as React from "react"

// Fail-closed period state cache keyed by period id
const periodStateCache = new Map<string, { state: PeriodState; fetchedAt: number }>()
const inflightRequests = new Map<string, Promise<PeriodState>>()
const CACHE_TTL_MS = 5 * 60 * 1000

type PeriodStatus = "open" | "closed" | "locked" | "unknown"

export type PeriodState = {
  periodId?: string | number
  periodName?: string
  status: PeriodStatus
  isOpen: boolean
  plClosed: boolean
  inventoryClosed: boolean
  canPostJournal: boolean
  canPostInventory: boolean
  humanMessage?: string
  suggestedNextAction?: string
  startDate?: string
  endDate?: string
  lastUpdated?: number
}

export type UsePeriodStateResult = {
  state: PeriodState
  loading: boolean
  error: string | null
  refetch: () => Promise<PeriodState>
}

const buildFailClosedState = (
  reason: string,
  periodId?: string | number
): PeriodState => ({
  periodId,
  status: "closed",
  isOpen: false,
  plClosed: true,
  inventoryClosed: true,
  canPostJournal: false,
  canPostInventory: false,
  humanMessage: reason,
  suggestedNextAction: "Retry later or contact finance.",
  lastUpdated: Date.now(),
})

const normalizeState = (
  payload: any,
  periodId: string | number
): PeriodState => {
  const period = payload?.period ?? payload?.data ?? payload?.periodState ?? null
  const rawStatus = (period?.status ?? payload?.status ?? "unknown").toString()
  const normalizedStatus = rawStatus.toLowerCase()
  const status: PeriodStatus =
    normalizedStatus === "open" || normalizedStatus === "closed" || normalizedStatus === "locked"
      ? (normalizedStatus as PeriodStatus)
      : "unknown"
  const plClosed = Boolean(period?.pl_closed ?? payload?.pl_closed)
  const inventoryClosed = Boolean(period?.inventory_closed ?? payload?.inventory_closed)
  const isOpen = status === "open" && !plClosed && !inventoryClosed
  const canPostJournal = payload?.canSubmitJournal ?? (status === "open" && !plClosed)
  const canPostInventory = payload?.canSubmitInventory ?? (status === "open" && !inventoryClosed)

  return {
    periodId: period?.id ?? periodId,
    periodName: period?.period_name ?? period?.name,
    status,
    isOpen,
    plClosed,
    inventoryClosed,
    canPostJournal,
    canPostInventory,
    humanMessage: payload?.human_message ?? payload?.message ?? payload?.error,
    suggestedNextAction: payload?.suggested_next_action,
    startDate: period?.start_date,
    endDate: period?.end_date,
    lastUpdated: Date.now(),
  }
}

const getCachedState = (periodId: string): PeriodState | null => {
  const cached = periodStateCache.get(periodId)
  if (!cached) return null
  const isFresh = Date.now() - cached.fetchedAt < CACHE_TTL_MS
  if (!isFresh) return null
  return cached.state
}

const setCachedState = (periodId: string, state: PeriodState) => {
  periodStateCache.set(periodId, { state, fetchedAt: Date.now() })
}

const fetchPeriodState = async (periodId: string): Promise<PeriodState> => {
  const existing = inflightRequests.get(periodId)
  if (existing) return existing

  const request = (async () => {
    try {
      const response = await fetch(`/api/accounting/periods/${periodId}/status`, {
        method: "GET",
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Period status request failed with ${response.status}`)
      }

      const payload = await response.json()
      const state = normalizeState(payload, periodId)
      setCachedState(periodId, state)
      return state
    } catch (error: any) {
      const message = error?.message ?? "Unable to verify period status"
      const state = buildFailClosedState(message, periodId)
      setCachedState(periodId, state)
      const wrappedError = new Error(message)
      ;(wrappedError as any).state = state
      throw wrappedError
    } finally {
      inflightRequests.delete(periodId)
    }
  })()

  inflightRequests.set(periodId, request)
  return request
}

/**
 * usePeriodState fetches and caches accounting period status (fail-closed on error).
 * It treats any error as closed to avoid letting actions proceed when status is unknown.
 */
export function usePeriodState(periodId?: string | number): UsePeriodStateResult {
  const [state, setState] = React.useState<PeriodState>(() =>
    buildFailClosedState("Checking period status...", periodId)
  )
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const key = periodId !== undefined && periodId !== null ? String(periodId) : ""

  const load = React.useCallback(
    async (force = false): Promise<PeriodState> => {
      if (!key) {
        const failState = buildFailClosedState("No period selected")
        setState(failState)
        setError("Missing period id")
        return failState
      }

      const cached = !force ? getCachedState(key) : null
      if (cached) {
        setState(cached)
        setError(null)
        return cached
      }

      setLoading(true)
      try {
        const nextState = await fetchPeriodState(key)
        setState(nextState)
        setError(null)
        return nextState
      } catch (err: any) {
        const message = err?.message ?? "Unable to verify period status"
        const failState = err?.state ?? buildFailClosedState(message, key)
        setState(failState)
        setError(message)
        return failState
      } finally {
        setLoading(false)
      }
    },
    [key]
  )

  React.useEffect(() => {
    load()
  }, [load])

  return {
    state,
    loading,
    error,
    refetch: () => load(true),
  }
}
