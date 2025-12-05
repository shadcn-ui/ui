"use client"

import * as React from "react"

import { useDesignSystemParam } from "@/app/(design)/hooks/use-design-system"
import {
  buildRegistryTheme,
  DEFAULT_CONFIG,
  FONTS,
  type DesignSystemConfig,
} from "@/app/(design)/lib/config"

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

  const registryTheme = React.useMemo(() => {
    if (!baseColor || !theme || !accent || !spacing || !radius) {
      return null
    }

    const config: DesignSystemConfig = {
      ...DEFAULT_CONFIG,
      baseColor,
      theme,
      accent,
      spacing,
      radius,
    }

    return buildRegistryTheme(config)
  }, [baseColor, theme, accent, spacing, radius])

  React.useEffect(() => {
    if (!registryTheme || !registryTheme.cssVars) {
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

    const {
      light: lightVars,
      dark: darkVars,
      theme: themeVars,
    } = registryTheme.cssVars

    let cssText = ":root {\n"
    // Add theme vars (shared across light/dark).
    if (themeVars) {
      Object.entries(themeVars).forEach(([key, value]) => {
        if (value) {
          cssText += `  --${key}: ${value};\n`
        }
      })
    }
    // Add light mode vars.
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
  }, [registryTheme])

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
