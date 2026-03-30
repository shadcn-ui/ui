"use client"

import * as React from "react"

const STORAGE_KEY = "framework"
const DEFAULT_FRAMEWORK = "react"

type Framework = "react" | "vue" | "svelte"

function isValidFramework(value: string): value is Framework {
  return value === "react" || value === "vue" || value === "svelte"
}

function getStoredFramework(): Framework {
  if (typeof window === "undefined") {
    return DEFAULT_FRAMEWORK
  }
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && isValidFramework(stored)) {
    return stored
  }
  return DEFAULT_FRAMEWORK
}

export function useFramework() {
  const [framework, setFrameworkState] = React.useState<Framework>(DEFAULT_FRAMEWORK)

  React.useEffect(() => {
    setFrameworkState(getStoredFramework())
  }, [])

  React.useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue && isValidFramework(e.newValue)) {
        setFrameworkState(e.newValue)
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const setFramework = React.useCallback((value: Framework) => {
    setFrameworkState(value)
    localStorage.setItem(STORAGE_KEY, value)
  }, [])

  return { framework, setFramework } as const
}
