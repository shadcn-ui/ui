"use client"

import { useQueryStates } from "nuqs"

import {
  canvaSearchParams,
  type CanvaSearchParams,
} from "@/app/(app)/design/lib/search-params"

/**
 * Hook to sync canva search params (zoom, scrollLeft, scrollTop).
 */
export function useCanvaSync() {
  const [params, setParams] = useQueryStates(canvaSearchParams, {
    shallow: false,
  })

  return { params, setParams } as {
    params: CanvaSearchParams
    setParams: (updates: Partial<CanvaSearchParams>) => Promise<void>
  }
}

