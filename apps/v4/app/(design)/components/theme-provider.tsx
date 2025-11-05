"use client"

import * as React from "react"

import {
  useDesignSystemParam,
  useDesignSystemReady,
} from "@/app/(design)/hooks/use-design-system-sync"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useDesignSystemParam("theme")
  const isReady = useDesignSystemReady()

  React.useEffect(() => {
    if (!isReady || !theme) {
      return
    }

    const body = document.body
    const themeClass = `theme-${theme}`

    // Remove all existing theme classes.
    body.classList.forEach((className) => {
      if (className.startsWith("theme-")) {
        body.classList.remove(className)
      }
    })

    // Add the new theme class.
    body.classList.add(themeClass)

    return () => {
      // Cleanup: remove theme class when component unmounts.
      body.classList.remove(themeClass)
    }
  }, [theme, isReady])

  if (!isReady) {
    return null
  }

  return <>{children}</>
}
