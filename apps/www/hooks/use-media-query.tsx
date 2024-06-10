import * as React from "react"

export function useMediaQuery(query: string) {
  const subscribe = React.useCallback((callback: (e: MediaQueryListEvent) => void) => {
    matchMedia(query).addEventListener("change", callback);
    return () => matchMedia(query).removeEventListener("change", callback);
  }, [query, callback]);

  const getSnapshot = React.useCallback(() => matchMedia(query).matches, [query]);

  return React.useSyncExternalStore(subscribe, getSnapshot);
}
