"use client"

import * as React from "react"

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
  const accent = useDesignSystemParam("accent")
  const menu = useDesignSystemParam("menu")
  const spacing = useDesignSystemParam("spacing")
  const radius = useDesignSystemParam("radius")
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

    const lightVars = { ...mergedTheme.cssVars.light }
    const darkVars = { ...mergedTheme.cssVars.dark }

    // If accent is bold, use primary/primary-foreground for accent/accent-foreground.
    if (accent === "bold") {
      lightVars.accent = lightVars.primary
      lightVars["accent-foreground"] = lightVars["primary-foreground"]
      darkVars.accent = darkVars.primary
      darkVars["accent-foreground"] = darkVars["primary-foreground"]
    }

    let cssText = ":root {\n"
    if (lightVars) {
      Object.entries(lightVars).forEach(([key, value]) => {
        if (value) {
          cssText += `  --${key}: ${value};\n`
        }
      })
    }
    // If spacing is compact, add spacing CSS variable.
    if (spacing === "compact") {
      cssText += "  --spacing: 0.20835rem;\n"
      cssText += "  --text-xs: 11px;\n"
      cssText += "  --text-sm: 13px;\n"
      cssText += "  --text-base: 15px;\n"
      cssText += "  --text-lg: 17px;\n"
      cssText += "  --text-xl: 19px;\n"
      cssText += "  --text-xs--line-height: calc(1 / var(--text-xs));\n"
      cssText += "  --text-sm--line-height: calc(1.25 / var(--text-sm));\n"
      cssText += "  --text-base--line-height: calc(1.5 / var(--text-base));\n"
      cssText += "  --text-lg--line-height: calc(1.75 / var(--text-lg));\n"
      cssText += "  --text-xl--line-height: calc(1.75 / var(--text-xl));\n"
    }

    // Add radius CSS variable based on radius value.
    if (radius === "none") {
      cssText += "  --radius: 0;\n"
    } else if (radius === "small") {
      cssText += "  --radius: 0.45rem;\n"
    } else if (radius === "default") {
      cssText += "  --radius: 0.625rem;\n"
    } else if (radius === "large") {
      cssText += "  --radius: 0.875rem;\n"
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
  }, [mergedTheme, accent, spacing, radius])

  // Handle menu inversion by adding/removing dark class to Radix menu content and select content.
  React.useEffect(() => {
    if (!menu) {
      return
    }

    const updateMenuElements = () => {
      const menuElements = document.querySelectorAll(
        "[data-radix-menu-content], [data-slot=select-content], [data-slot=dropdown-menu-content], [data-slot=dropdown-menu-sub-content], [data-slot=context-menu-content], [data-slot=context-menu-sub-content], [data-slot=menubar-content], [data-slot=menubar-sub-content],[data-slot=combobox-content]"
      )
      menuElements.forEach((element) => {
        if (menu === "inverted") {
          element.classList.add("dark")
        } else {
          element.classList.remove("dark")
        }
      })
    }

    // Update existing menu elements.
    updateMenuElements()

    // Watch for new menu elements being added to the DOM.
    const observer = new MutationObserver(() => {
      updateMenuElements()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [menu])

  if (!isReady) {
    return null
  }

  return <>{children}</>
}
