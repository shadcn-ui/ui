"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type HistoryContextValue = {
  canGoBack: boolean
  canGoForward: boolean
  goBack: () => void
  goForward: () => void
}

const HistoryContext = React.createContext<HistoryContextValue | null>(null)

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [maxIndex, setMaxIndex] = React.useState(0)
  const entriesRef = React.useRef<string[]>([])
  const pendingIndexRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    const query = searchParams.toString()
    const entries = entriesRef.current

    if (entries.length === 0) {
      entriesRef.current = [query]
      setCurrentIndex(0)
      setMaxIndex(0)
      pendingIndexRef.current = null
      return
    }

    const pendingIndex = pendingIndexRef.current
    if (pendingIndex !== null) {
      pendingIndexRef.current = null
      if (entries[pendingIndex] === query) {
        setCurrentIndex(pendingIndex)
        setMaxIndex(entries.length - 1)
        return
      }
    }

    const currentQuery = entries[currentIndex]
    if (query === currentQuery) {
      return
    }

    const nextEntries = entries.slice(0, currentIndex + 1)
    nextEntries.push(query)
    entriesRef.current = nextEntries

    const nextIndex = nextEntries.length - 1
    setCurrentIndex(nextIndex)
    setMaxIndex(nextIndex)
  }, [searchParams, currentIndex])

  const canGoBack = currentIndex > 0
  const canGoForward = currentIndex < maxIndex

  const goBack = React.useCallback(() => {
    if (currentIndex > 0) {
      const nextIndex = currentIndex - 1
      const query = entriesRef.current[nextIndex]
      pendingIndexRef.current = nextIndex
      router.replace(query ? `${pathname}?${query}` : pathname)
    }
  }, [currentIndex, pathname, router])

  const goForward = React.useCallback(() => {
    if (currentIndex < maxIndex) {
      const nextIndex = currentIndex + 1
      const query = entriesRef.current[nextIndex]
      pendingIndexRef.current = nextIndex
      router.replace(query ? `${pathname}?${query}` : pathname)
    }
  }, [currentIndex, maxIndex, pathname, router])

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
