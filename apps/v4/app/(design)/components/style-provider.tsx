"use client"

import * as React from "react"

import {
  useDesignSystemParam,
  useDesignSystemReady,
} from "@/app/(design)/hooks/use-design-system-sync"

export function StyleProvider({ children }: { children: React.ReactNode }) {
  const style = useDesignSystemParam("style")
  const isReady = useDesignSystemReady()

  React.useEffect(() => {
    if (!isReady || !style) {
      return
    }

    const body = document.body
    const styleClass = `style-${style}`

    body.classList.forEach((className) => {
      if (className.startsWith("style-")) {
        body.classList.remove(className)
      }
    })

    body.classList.add(styleClass)

    return () => {
      body.classList.remove(styleClass)
    }
  }, [style, isReady])

  if (!isReady) {
    return null
  }

  return <>{children}</>
}
