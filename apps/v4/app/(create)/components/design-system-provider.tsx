"use client"

import * as React from "react"

import {
  buildRegistryTheme,
  DEFAULT_CONFIG,
  type DesignSystemConfig,
} from "@/registry/config"
import { useIframeMessageListener } from "@/app/(create)/hooks/use-iframe-sync"
import { FONTS } from "@/app/(create)/lib/fonts"
import {
  useDesignSystemSearchParams,
  type DesignSystemSearchParams,
} from "@/app/(create)/lib/search-params"

const THEME_STYLE_ELEMENT_ID = "design-system-theme-vars"
const MANAGED_BODY_CLASS_PREFIXES = ["style-", "base-color-"] as const

type RegistryThemeCssVars = NonNullable<
  ReturnType<typeof buildRegistryTheme>["cssVars"]
>

function removeManagedBodyClasses(body: Element) {
  for (const className of Array.from(body.classList)) {
    if (
      MANAGED_BODY_CLASS_PREFIXES.some((prefix) => className.startsWith(prefix))
    ) {
      body.classList.remove(className)
    }
  }
}

function buildCssRule(selector: string, cssVars?: Record<string, string>) {
  const declarations = Object.entries(cssVars ?? {})
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n")

  if (!declarations) {
    return `${selector} {}\n`
  }

  return `${selector} {\n${declarations}\n}\n`
}

function buildThemeCssText(cssVars: RegistryThemeCssVars) {
  return [
    buildCssRule(":root", {
      ...(cssVars.theme ?? {}),
      ...(cssVars.light ?? {}),
    }),
    buildCssRule(".dark", cssVars.dark),
  ].join("\n")
}

export function DesignSystemProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [searchParams, setSearchParams] = useDesignSystemSearchParams({
    shallow: true, // No need to go through the server…
    history: "replace", // …or push updates into the iframe history.
  })
  const [isReady, setIsReady] = React.useState(false)
  const { style, theme, font, baseColor, menuAccent, menuColor, radius } =
    searchParams
  const effectiveRadius = style === "lyra" ? "none" : radius
  const selectedFont = React.useMemo(
    () => FONTS.find((fontOption) => fontOption.value === font),
    [font]
  )
  const initialFontSansRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    initialFontSansRef.current =
      document.documentElement.style.getPropertyValue("--font-sans")

    return () => {
      removeManagedBodyClasses(document.body)
      document.getElementById(THEME_STYLE_ELEMENT_ID)?.remove()

      if (initialFontSansRef.current) {
        document.documentElement.style.setProperty(
          "--font-sans",
          initialFontSansRef.current
        )
        return
      }

      document.documentElement.style.removeProperty("--font-sans")
    }
  }, [])

  const handleDesignSystemMessage = React.useCallback(
    (nextParams: DesignSystemSearchParams) => {
      setSearchParams(nextParams)
    },
    [setSearchParams]
  )

  useIframeMessageListener("design-system-params", handleDesignSystemMessage)

  React.useEffect(() => {
    if (style === "lyra" && radius !== "none") {
      setSearchParams({ radius: "none" })
    }
  }, [style, radius, setSearchParams])

  // Use useLayoutEffect for synchronous style updates to prevent flash.
  React.useLayoutEffect(() => {
    if (!style || !theme || !font || !baseColor) {
      return
    }

    const body = document.body

    // Iterate over a snapshot so removals do not affect traversal.
    removeManagedBodyClasses(body)
    body.classList.add(`style-${style}`, `base-color-${baseColor}`)

    // Update font.
    // Always set --font-sans for the preview so the selected font is visible.
    // The font type (sans/serif/mono) is metadata for the CLI updater.
    if (selectedFont) {
      const fontFamily = selectedFont.font.style.fontFamily
      document.documentElement.style.setProperty("--font-sans", fontFamily)
    }

    setIsReady(true)
  }, [style, theme, font, baseColor, selectedFont])

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

    let styleElement = document.getElementById(
      THEME_STYLE_ELEMENT_ID
    ) as HTMLStyleElement | null

    if (!styleElement) {
      styleElement = document.createElement("style")
      styleElement.id = THEME_STYLE_ELEMENT_ID
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = buildThemeCssText(registryTheme.cssVars)
  }, [registryTheme])

  // Handle menu color inversion by adding/removing dark class to elements with cn-menu-target.
  // useLayoutEffect to apply classes synchronously before paint, avoiding flash.
  React.useLayoutEffect(() => {
    if (!menuColor) {
      return
    }

    const isInvertedMenu =
      menuColor === "inverted" || menuColor === "inverted-translucent"
    const isTranslucentMenu =
      menuColor === "default-translucent" ||
      menuColor === "inverted-translucent"
    let frameId = 0

    const updateMenuElements = () => {
      const allElements = document.querySelectorAll<HTMLElement>(
        ".cn-menu-target, [data-menu-translucent]"
      )

      if (allElements.length === 0) {
        return
      }

      // Disable transitions while toggling classes.
      allElements.forEach((element) => {
        element.style.transition = "none"
      })

      allElements.forEach((element) => {
        if (element.classList.contains("cn-menu-target")) {
          if (isInvertedMenu) {
            element.classList.add("dark")
          } else {
            element.classList.remove("dark")
          }
        }

        // When translucent is enabled, move from data-attr to class so styles apply.
        // When disabled, move back to a data-attr so the element stays queryable
        // for future toggles without losing its identity as a menu element.
        if (isTranslucentMenu) {
          element.classList.add("cn-menu-translucent")
          element.removeAttribute("data-menu-translucent")
        } else if (element.classList.contains("cn-menu-translucent")) {
          element.classList.remove("cn-menu-translucent")
          element.setAttribute("data-menu-translucent", "")
        }
      })

      // Force a reflow, then re-enable transitions.
      void document.body.offsetHeight
      allElements.forEach((element) => {
        element.style.transition = ""
      })
    }

    const scheduleMenuUpdate = () => {
      if (frameId) {
        return
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0
        updateMenuElements()
      })
    }

    // Update existing menu elements.
    updateMenuElements()

    // Watch for new menu elements being added to the DOM.
    const observer = new MutationObserver(() => {
      scheduleMenuUpdate()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [menuColor])

  if (!isReady) {
    return null
  }

  return <>{children}</>
}
