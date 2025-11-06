"use client"

import * as React from "react"

import { useDesignSystemParam } from "@/app/(app)/design/hooks/use-design-system-sync"

export function StyleProvider({ children }: { children: React.ReactNode }) {
  const style = useDesignSystemParam("style")
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    if (!style) {
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
    setIsReady(true)

    return () => {
      body.classList.remove(styleClass)
    }
  }, [style])

  if (!isReady) {
    return null
  }

  return <>{children}</>
}
