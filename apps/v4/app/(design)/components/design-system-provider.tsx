"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { FONTS } from "@/registry/fonts"
import { useDesignSystemParam } from "@/app/(design)/hooks/use-design-system"
import { buildTheme } from "@/app/(design)/lib/merge-theme"

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

    const baseColorClass = `base-color-${baseColor}`
    body.classList.forEach((className) => {
      if (className.startsWith("base-color-")) {
        body.classList.remove(className)
      }
    })
    body.classList.add(baseColorClass)

    const selectedFont = FONTS.find((f) => f.value === font)
    let hasFont = false
    if (selectedFont) {
      const fontFamily = selectedFont.font.style.fontFamily
      document.documentElement.style.setProperty("--font-sans", fontFamily)
      hasFont = true
    }

    setIsReady(true)

    return () => {
      body.classList.remove(styleClass)
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
    if (!mergedTheme || !mergedTheme.cssVars) {
      return
    }

    const styleId = "design-system-theme-vars"
    let styleElement = document.getElementById(
      styleId
    ) as HTMLStyleElement | null

    if (!styleElement) {
      styleElement = document.createElement("style")
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    const lightVars = mergedTheme.cssVars.light
    const darkVars = mergedTheme.cssVars.dark

    let cssText = ":root {\n"
    if (lightVars) {
      Object.entries(lightVars).forEach(([key, value]) => {
        if (value) {
          cssText += `  --${key}: ${value};\n`
        }
      })
    }
    cssText += "}\n\n"

    cssText += ".dark {\n"
    if (darkVars) {
      Object.entries(darkVars).forEach(([key, value]) => {
        if (value) {
          cssText += `  --${key}: ${value};\n`
        }
      })
    }
    cssText += "}\n"

    styleElement.textContent = cssText

    return () => {
      const element = document.getElementById(styleId)
      if (element) {
        element.remove()
      }
    }
  }, [mergedTheme])

  if (!isReady) {
    return null
  }

  return <>{children}</>
}
