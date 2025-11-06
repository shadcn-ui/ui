"use client"

import * as React from "react"

import { fontMap } from "@/registry/fonts"
import { useDesignSystemParam } from "@/app/(app)/design/hooks/use-design-system"

export function DesignSystemProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const style = useDesignSystemParam("style")
  const theme = useDesignSystemParam("theme")
  const font = useDesignSystemParam("font")
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    if (!style || !theme || !font) {
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

    const themeClass = `theme-${theme}`
    body.classList.forEach((className) => {
      if (className.startsWith("theme-")) {
        body.classList.remove(className)
      }
    })
    body.classList.add(themeClass)

    const selectedFont = fontMap[font as keyof typeof fontMap]
    let hasFont = false
    if (selectedFont) {
      const fontFamily = selectedFont.style.fontFamily
      document.documentElement.style.setProperty("--font-sans", fontFamily)
      hasFont = true
    }

    setIsReady(true)

    return () => {
      body.classList.remove(styleClass)
      body.classList.remove(themeClass)
      if (hasFont) {
        document.documentElement.style.removeProperty("--font-sans")
      }
    }
  }, [style, theme, font])

  if (!isReady) {
    return null
  }

  return <>{children}</>
}
