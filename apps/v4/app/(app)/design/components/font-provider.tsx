"use client"

import * as React from "react"

import { fontMap } from "@/registry/fonts"
import { useDesignSystemParam } from "@/app/(app)/design/hooks/use-design-system-sync"

export function FontProvider({ children }: { children: React.ReactNode }) {
  const font = useDesignSystemParam("font")
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    if (!font) {
      return
    }

    const selectedFont = fontMap[font as keyof typeof fontMap]

    if (!selectedFont) {
      return
    }

    // Get the font family from the Next.js font object.
    const fontFamily = selectedFont.style.fontFamily

    // Set CSS variable --font-sans on document root.
    document.documentElement.style.setProperty("--font-sans", fontFamily)
    setIsReady(true)

    return () => {
      document.documentElement.style.removeProperty("--font-sans")
    }
  }, [font])

  if (!isReady) {
    return null
  }

  return <>{children}</>
}
