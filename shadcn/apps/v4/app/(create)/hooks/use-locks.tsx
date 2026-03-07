"use client"

import * as React from "react"

export type LockableParam =
  | "style"
  | "baseColor"
  | "theme"
  | "iconLibrary"
  | "font"
  | "menuAccent"
  | "menuColor"
  | "radius"

type LocksContextValue = {
  locks: Set<LockableParam>
  isLocked: (param: LockableParam) => boolean
  toggleLock: (param: LockableParam) => void
}

const LocksContext = React.createContext<LocksContextValue | null>(null)

export function LocksProvider({ children }: { children: React.ReactNode }) {
  const [locks, setLocks] = React.useState<Set<LockableParam>>(new Set())

  const isLocked = React.useCallback(
    (param: LockableParam) => locks.has(param),
    [locks]
  )

  const toggleLock = React.useCallback((param: LockableParam) => {
    setLocks((prev) => {
      const next = new Set(prev)
      if (next.has(param)) {
        next.delete(param)
      } else {
        next.add(param)
      }
      return next
    })
  }, [])

  const value = React.useMemo(
    () => ({ locks, isLocked, toggleLock }),
    [locks, isLocked, toggleLock]
  )

  return <LocksContext value={value}>{children}</LocksContext>
}

export function useLocks() {
  const context = React.useContext(LocksContext)
  if (!context) {
    throw new Error("useLocks must be used within LocksProvider")
  }
  return context
}
