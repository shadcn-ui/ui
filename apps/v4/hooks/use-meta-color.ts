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
    console.log(document.querySelector('meta[name="theme-color"]'))
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", color)
    console.log(`Setting meta color to ${color}`)
  }, [])

  return {
    metaColor,
    setMetaColor,
  }
}
