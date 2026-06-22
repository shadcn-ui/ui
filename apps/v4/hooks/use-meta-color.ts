import * as React from "react"
import { useTheme } from "next-themes"

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#0a0a0a",
}

export function useMetaColor() {
  const { resolvedTheme } = useTheme()

  const metaColor = React.useMemo(() => {
    return resolvedTheme !== "dark"
      ? META_THEME_COLORS.light
      : META_THEME_COLORS.dark
  }, [resolvedTheme])

  const setMetaColor = React.useCallback((color: string) => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", color)
  }, [])

  return {
    metaColor,
    setMetaColor,
  }
}
