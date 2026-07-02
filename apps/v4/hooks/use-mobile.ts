import * as React from "react"

export function useIsMobile(mobileBreakpoint = 768) {
  const query = `(max-width: ${mobileBreakpoint - 1}px)`

  const subscribe = React.useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", callback)
      return () => mql.removeEventListener("change", callback)
    },
    [query]
  )

  const getSnapshot = React.useCallback(() => {
    return window.matchMedia(query).matches
  }, [query])

  return React.useSyncExternalStore(subscribe, getSnapshot, () => false)
}
