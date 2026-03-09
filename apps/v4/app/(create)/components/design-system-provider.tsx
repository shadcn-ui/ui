"use client"

import * as React from "react"

import {
  buildRegistryTheme,
  DEFAULT_CONFIG,
  type DesignSystemConfig,
  type RadiusValue,
} from "@/registry/config"
import { useIframeMessageListener } from "@/app/(create)/hooks/use-iframe-sync"
import { FONTS } from "@/app/(create)/lib/fonts"
import {
  useDesignSystemSearchParams,
  type DesignSystemSearchParams,
} from "@/app/(create)/lib/search-params"

export function DesignSystemProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [searchParams, setSearchParams] = useDesignSystemSearchParams({
    shallow: true, // No need to go through the server…
    history: "replace", // …or push updates into the iframe history.
  })
  const [liveSearchParams, setLiveSearchParams] = React.useState(searchParams)
  const [isReady, setIsReady] = React.useState(false)
  const { style, theme, font, baseColor, menuAccent, menuColor, radius } =
    liveSearchParams
  const effectiveRadius = style === "lyra" ? "none" : radius

  React.useEffect(() => {
    setLiveSearchParams(searchParams)
  }, [searchParams])

  const handleDesignSystemMessage = React.useCallback(
    (nextParams: DesignSystemSearchParams) => {
      setLiveSearchParams(nextParams)
      setSearchParams(nextParams)
    },
    [setSearchParams]
  )

  useIframeMessageListener("design-system-params", handleDesignSystemMessage)

  React.useEffect(() => {
    if (style === "lyra" && radius !== "none") {
      setLiveSearchParams((prev) => ({
        ...prev,
        radius: "none",
      }))
      setSearchParams({ radius: "none" as RadiusValue })
    }
  }, [style, radius, setSearchParams])

  // Use useLayoutEffect for synchronous style updates to prevent flash.
  React.useLayoutEffect(() => {
    if (!style || !theme || !font || !baseColor) {
      return
    }

    const body = document.body

    // Iterate over a snapshot so removals do not affect traversal.
    Array.from(body.classList).forEach((className) => {
      if (
        className.startsWith("style-") ||
        className.startsWith("base-color-")
      ) {
        body.classList.remove(className)
      }
    })
    body.classList.add(`style-${style}`, `base-color-${baseColor}`)

    // Update font.
    // Always set --font-sans for the preview so the selected font is visible.
    // The font type (sans/serif/mono) is metadata for the CLI updater.
    const selectedFont = FONTS.find((f) => f.value === font)
    if (selectedFont) {
      const fontFamily = selectedFont.font.style.fontFamily
      document.documentElement.style.setProperty("--font-sans", fontFamily)
    }

    setIsReady(true)
  }, [style, theme, font, baseColor])

  const registryTheme = React.useMemo(() => {
    if (!baseColor || !theme || !menuAccent || !effectiveRadius) {
      return null
    }

    const config: DesignSystemConfig = {
      ...DEFAULT_CONFIG,
      baseColor,
      theme,
      menuAccent,
      radius: effectiveRadius,
    }

    return buildRegistryTheme(config)
  }, [baseColor, theme, menuAccent, effectiveRadius])

  // Use useLayoutEffect for synchronous CSS var updates.
  React.useLayoutEffect(() => {
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
  }, [registryTheme])

  // Handle menu color inversion by adding/removing dark class to elements with cn-menu-target.
  React.useEffect(() => {
    if (!menuColor) {
      return
    }

    const updateMenuElements = () => {
      const menuElements = document.querySelectorAll(".cn-menu-target")
      menuElements.forEach((element) => {
        if (menuColor === "inverted") {
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
  }, [menuColor])

  if (!isReady) {
    return null
  }

  return <>{children}</>
}
