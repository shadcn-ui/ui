import * as React from "react"

export function useIsMobile(mobileBreakpoint = 768): boolean {
  const subscribe = React.useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`)
      mql.addEventListener("change", callback)
      return () => mql.removeEventListener("change", callback)
    },
    [mobileBreakpoint]
  )

  const getSnapshot = React.useCallback(
    () => window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`).matches,
    [mobileBreakpoint]
  )

  return React.useSyncExternalStore(subscribe, getSnapshot, () => false)
}
