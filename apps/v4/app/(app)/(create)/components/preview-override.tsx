"use client"

import * as React from "react"

import type { DesignSystemSearchParams } from "@/app/(app)/(create)/lib/search-params"

// Uncommitted params applied to the preview while hovering a picker item.
// Kept out of the URL on purpose: committing to the URL would re-encode the
// preset code and push a history entry for every hovered item, polluting
// undo/redo and shareable links. The preview iframe receives these via the
// same postMessage channel as committed params and reverts when cleared.
type PreviewOverride = Partial<DesignSystemSearchParams> | null

// How long the pointer must settle before a preview applies. Every mousemove
// over a picker item re-arms this trailing timer, so nothing applies while
// the cursor is in motion — each application is a full theme rewrite in the
// iframe. Clears are never debounced: reverting on leave/Escape must feel
// instant.
const PREVIEW_OVERRIDE_DEBOUNCE_MS = 50

// The value and the actions live in separate contexts so pickers (which only
// call the stable setters) never re-render while a preview is applied. Only
// the preview iframe host subscribes to the value.
const PreviewOverrideValueContext = React.createContext<PreviewOverride>(null)

const PreviewOverrideActionsContext = React.createContext<{
  setOverride: (override: Partial<DesignSystemSearchParams>) => void
  clearOverride: () => void
} | null>(null)

function isSameOverride(a: PreviewOverride, b: PreviewOverride) {
  if (a === b) {
    return true
  }

  if (!a || !b) {
    return false
  }

  const aKeys = Object.keys(a) as (keyof DesignSystemSearchParams)[]
  const bKeys = Object.keys(b) as (keyof DesignSystemSearchParams)[]

  return (
    aKeys.length === bKeys.length && aKeys.every((key) => a[key] === b[key])
  )
}

export function PreviewOverrideProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [override, setOverrideState] = React.useState<PreviewOverride>(null)
  const timeoutRef = React.useRef<number | null>(null)

  const cancelPendingOverride = React.useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  React.useEffect(() => cancelPendingOverride, [cancelPendingOverride])

  const setOverride = React.useCallback(
    (next: Partial<DesignSystemSearchParams>) => {
      cancelPendingOverride()
      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null
        // Skip identical updates: mouseenter and focus both fire for the
        // hovered item, and hovering the committed value is a no-op.
        setOverrideState((current) =>
          isSameOverride(current, next) ? current : next
        )
      }, PREVIEW_OVERRIDE_DEBOUNCE_MS)
    },
    [cancelPendingOverride]
  )

  const clearOverride = React.useCallback(() => {
    cancelPendingOverride()
    setOverrideState(null)
  }, [cancelPendingOverride])

  const actions = React.useMemo(
    () => ({ setOverride, clearOverride }),
    [setOverride, clearOverride]
  )

  return (
    <PreviewOverrideActionsContext.Provider value={actions}>
      <PreviewOverrideValueContext.Provider value={override}>
        {children}
      </PreviewOverrideValueContext.Provider>
    </PreviewOverrideActionsContext.Provider>
  )
}

// For pickers: stable setters only, never re-renders on override changes.
export function usePreviewOverride() {
  const context = React.useContext(PreviewOverrideActionsContext)

  if (!context) {
    throw new Error(
      "usePreviewOverride must be used within a PreviewOverrideProvider."
    )
  }

  return context
}

// For the preview iframe host: the current override value.
export function usePreviewOverrideValue() {
  return React.useContext(PreviewOverrideValueContext)
}
