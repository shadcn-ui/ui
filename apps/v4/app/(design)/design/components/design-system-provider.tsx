"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { fontMap } from "@/registry/fonts"
import { useDesignSystemParam } from "@/app/(design)/design/hooks/use-design-system"
import { buildTheme } from "@/app/(design)/design/lib/merge-theme"

export function DesignSystemProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const style = useDesignSystemParam("style")
  const theme = useDesignSystemParam("theme")
  const font = useDesignSystemParam("font")
  const baseColor = useDesignSystemParam("baseColor")
  const { resolvedTheme } = useTheme()
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    if (!style || !theme || !font || !baseColor) {
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

    const baseColorClass = `base-color-${baseColor}`
    body.classList.forEach((className) => {
      if (className.startsWith("base-color-")) {
        body.classList.remove(className)
      }
    })
    body.classList.add(baseColorClass)

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
      body.classList.remove(baseColorClass)
      if (hasFont) {
        document.documentElement.style.removeProperty("--font-sans")
      }
    }
  }, [style, theme, font, baseColor])

  const mergedTheme = React.useMemo(() => {
    if (!baseColor || !theme) {
      return null
    }
    return buildTheme(baseColor, theme)
  }, [baseColor, theme])

  React.useEffect(() => {
    if (!mergedTheme || !mergedTheme.cssVars || !resolvedTheme) {
      return
    }

    const body = document.body
    const isDark = resolvedTheme === "dark"
    const cssVars = isDark
      ? mergedTheme.cssVars.dark
      : mergedTheme.cssVars.light

    if (!cssVars) {
      return
    }

    Object.entries(cssVars).forEach(([key, value]) => {
      if (value) {
        body.style.setProperty(`--${key}`, value)
      }
    })

    return () => {
      Object.keys(cssVars).forEach((key) => {
        body.style.removeProperty(`--${key}`)
      })
    }
  }, [mergedTheme, resolvedTheme])

  if (!isReady) {
    return null
  }

  return <>{children}</>
}
