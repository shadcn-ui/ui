"use client"

import * as React from "react"

type HistoryContextValue = {
  canGoBack: boolean
  canGoForward: boolean
  goBack: () => void
  goForward: () => void
}

const HistoryContext = React.createContext<HistoryContextValue | null>(null)

// Key used to store our navigation index in history.state.
const NAV_INDEX_KEY = "__dsNavIndex"

function getIndex(state: unknown) {
  if (state && typeof state === "object" && NAV_INDEX_KEY in state) {
    return (state as Record<string, number>)[NAV_INDEX_KEY]
  }
  return undefined
}

// Patch pushState and replaceState at module level so we intercept every
// caller (nuqs, Next.js router, etc.). Next.js calls replaceState after
// pushState to update its internal tree, so we must preserve our tag
// across both.
if (typeof window !== "undefined") {
  const originalPush = History.prototype.pushState
  const originalReplace = History.prototype.replaceState

  // Patch replaceState to preserve our index tag when Next.js
  // overwrites history state with its own internal data.
  History.prototype.replaceState = function (
    data: unknown,
    unused: string,
    url?: string | URL | null
  ) {
    const existingIndex = getIndex(this.state)
    if (existingIndex !== undefined && data && typeof data === "object") {
      data = { ...data, [NAV_INDEX_KEY]: existingIndex }
    }
    originalReplace.call(this, data, unused, url)
  }

  // Patch pushState to tag each entry with an incrementing index.
  History.prototype.pushState = function (
    data: unknown,
    unused: string,
    url?: string | URL | null
  ) {
    const currentIdx = getIndex(this.state) ?? 0
    const newIndex = currentIdx + 1
    const taggedData =
      data && typeof data === "object"
        ? { ...data, [NAV_INDEX_KEY]: newIndex }
        : { [NAV_INDEX_KEY]: newIndex }

    originalPush.call(this, taggedData, unused, url)

    // Dispatch a custom event so the provider can react.
    window.dispatchEvent(
      new CustomEvent("__ds_pushstate", { detail: { index: newIndex } })
    )
  }
}

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [maxIndex, setMaxIndex] = React.useState(0)

  React.useEffect(() => {
    // Tag the current entry if it doesn't already have an index.
    if (getIndex(history.state) === undefined) {
      const state = history.state
      // Use Object.assign to add our key without triggering our
      // replaceState patch (which only preserves existing indices).
      history.replaceState(
        state && typeof state === "object"
          ? { ...state, [NAV_INDEX_KEY]: 0 }
          : { [NAV_INDEX_KEY]: 0 },
        ""
      )
    } else {
      const idx = getIndex(history.state)!
      setCurrentIndex(idx)
      setMaxIndex(idx)
    }

    const handlePush = (e: Event) => {
      const idx = (e as CustomEvent<{ index: number }>).detail.index
      setCurrentIndex(idx)
      setMaxIndex(idx)
    }

    const handlePopState = () => {
      const idx = getIndex(history.state) ?? 0
      setCurrentIndex(idx)
    }

    window.addEventListener("__ds_pushstate", handlePush)
    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("__ds_pushstate", handlePush)
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  const canGoBack = currentIndex > 0
  const canGoForward = currentIndex < maxIndex

  const goBack = React.useCallback(() => {
    if (currentIndex > 0) {
      history.back()
    }
  }, [currentIndex])

  const goForward = React.useCallback(() => {
    if (currentIndex < maxIndex) {
      history.forward()
    }
  }, [currentIndex, maxIndex])

  const value = React.useMemo(
    () => ({ canGoBack, canGoForward, goBack, goForward }),
    [canGoBack, canGoForward, goBack, goForward]
  )

  return <HistoryContext value={value}>{children}</HistoryContext>
}

export function useHistory() {
  const context = React.useContext(HistoryContext)
  if (!context) {
    throw new Error("useHistory must be used within HistoryProvider")
  }
  return context
}
