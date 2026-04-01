"use client"

import * as React from "react"

const STORAGE_KEY = "framework"
const DEFAULT_FRAMEWORK = "react"

type Framework = "react" | "vue" | "svelte" | "ember"

function isValidFramework(value: string): value is Framework {
  return value === "react" || value === "vue" || value === "svelte" || value === "ember"
}

// Module-level shared store
let currentFramework: Framework = DEFAULT_FRAMEWORK
const listeners = new Set<() => void>()

function getSnapshot(): Framework {
  return currentFramework
}

function getServerSnapshot(): Framework {
  return DEFAULT_FRAMEWORK
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

// Initialize from localStorage on module load (client only)
if (typeof window !== "undefined") {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && isValidFramework(stored)) {
    currentFramework = stored
  }

  // Listen for cross-tab changes
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY && e.newValue && isValidFramework(e.newValue)) {
      currentFramework = e.newValue
      emitChange()
    }
  })
}

export function useFramework() {
  const framework = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  const setFramework = React.useCallback((value: Framework) => {
    currentFramework = value
    localStorage.setItem(STORAGE_KEY, value)
    emitChange()
  }, [])

  return { framework, setFramework } as const
}
