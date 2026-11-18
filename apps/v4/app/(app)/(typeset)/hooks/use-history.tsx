"use client"

import * as React from "react"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

import {
  parseTypesetSnapshot,
  TYPESET_PARAM_KEYS,
  useTypesetSearchParams,
} from "@/app/(app)/(typeset)/lib/search-params"

type HistoryContextValue = {
  canGoBack: boolean
  canGoForward: boolean
  goBack: () => void
  goForward: () => void
}

const HistoryContext = React.createContext<HistoryContextValue | null>(null)

// Reads useSearchParams() in its own Suspense boundary (mirrors /create): it
// reflects the SETTLED URL, coalescing the transient values nuqs emits
// mid-update so we don't record phantom history entries.
function ParamsSync({ onChange }: { onChange: (snapshot: string) => void }) {
  const searchParams = useSearchParams()
  // A history entry is a snapshot of every typeset param (unlike /create,
  // where the whole design system is one encoded `preset` string). Absent
  // keys snapshot as null so restoring clears them back to their default.
  const snapshot = JSON.stringify(
    Object.fromEntries(
      TYPESET_PARAM_KEYS.map((key) => [key, searchParams.get(key)])
    )
  )

  React.useEffect(() => {
    onChange(snapshot)
  }, [snapshot, onChange])

  return null
}

export function TypesetHistoryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Write through the shallow search-params hook (not router.replace) so the
  // header's preset sync doesn't get reset, same rationale as /create.
  const [, setParams] = useTypesetSearchParams()

  const [snapshot, setSnapshot] = React.useState("")

  const entriesRef = React.useRef<string[]>([])
  const indexRef = React.useRef(0)
  const maxIndexRef = React.useRef(0)
  const isNavigatingRef = React.useRef(false)
  const initedRef = React.useRef(false)

  const [index, setIndex] = React.useState(0)
  const [maxIndex, setMaxIndex] = React.useState(0)

  const onChange = React.useCallback((next: string) => {
    setSnapshot(next)
  }, [])

  React.useEffect(() => {
    // "" is the initial sentinel before ParamsSync reports the settled URL.
    if (!snapshot) {
      return
    }

    // Seed the stack with the first real snapshot (no undo available yet).
    if (!initedRef.current) {
      initedRef.current = true
      entriesRef.current = [snapshot]
      return
    }

    if (isNavigatingRef.current) {
      isNavigatingRef.current = false
      return
    }

    if (snapshot === entriesRef.current[indexRef.current]) {
      return
    }

    const nextEntries = entriesRef.current.slice(0, indexRef.current + 1)
    nextEntries.push(snapshot)
    entriesRef.current = nextEntries

    const nextIndex = nextEntries.length - 1
    indexRef.current = nextIndex
    maxIndexRef.current = nextIndex
    setIndex(nextIndex)
    setMaxIndex(nextIndex)
  }, [snapshot])

  const canGoBack = index > 0
  const canGoForward = index < maxIndex

  const restore = React.useCallback(
    (entry: string) => {
      setParams(parseTypesetSnapshot(entry), { history: "replace" })
    },
    [setParams]
  )

  const goBack = React.useCallback(() => {
    if (indexRef.current <= 0) {
      return
    }
    isNavigatingRef.current = true
    const nextIndex = indexRef.current - 1
    indexRef.current = nextIndex
    setIndex(nextIndex)
    restore(entriesRef.current[nextIndex])
  }, [restore])

  const goForward = React.useCallback(() => {
    if (indexRef.current >= maxIndexRef.current) {
      return
    }
    isNavigatingRef.current = true
    const nextIndex = indexRef.current + 1
    indexRef.current = nextIndex
    setIndex(nextIndex)
    restore(entriesRef.current[nextIndex])
  }, [restore])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey) {
        return
      }
      if (
        (e.target instanceof HTMLElement && e.target.isContentEditable) ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }
      const key = e.key.toLowerCase()
      if ((key === "z" && e.shiftKey) || (key === "y" && e.ctrlKey)) {
        e.preventDefault()
        goForward()
        return
      }
      if (key === "z") {
        e.preventDefault()
        goBack()
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [goBack, goForward])

  const value = React.useMemo(
    () => ({ canGoBack, canGoForward, goBack, goForward }),
    [canGoBack, canGoForward, goBack, goForward]
  )

  return (
    <HistoryContext value={value}>
      <Suspense>
        <ParamsSync onChange={onChange} />
      </Suspense>
      {children}
    </HistoryContext>
  )
}

export function useHistory() {
  const context = React.useContext(HistoryContext)
  if (!context) {
    throw new Error("useHistory must be used within TypesetHistoryProvider")
  }
  return context
}
