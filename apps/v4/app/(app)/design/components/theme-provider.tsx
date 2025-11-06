"use client"

import * as React from "react"

import { useDesignSystemParam } from "@/app/(app)/design/hooks/use-design-system-sync"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useDesignSystemParam("theme")
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    if (!theme) {
      return
    }

    const body = document.body
    const themeClass = `theme-${theme}`

    body.classList.forEach((className) => {
      if (className.startsWith("theme-")) {
        body.classList.remove(className)
      }
    })

    body.classList.add(themeClass)
    setIsReady(true)

    return () => {
      body.classList.remove(themeClass)
    }
  }, [theme])

  if (!isReady) {
    return null
  }

  return <>{children}</>
}
