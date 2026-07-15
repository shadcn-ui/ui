"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { useMetaColor } from "@/hooks/use-meta-color"

export function useThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const { setMetaColor, metaColor } = useMetaColor()

  React.useEffect(() => {
    setMetaColor(metaColor)
  }, [metaColor, setMetaColor])

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  // Listen for the D key to toggle theme.
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        (e.key === "d" || e.key === "D") &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        if (
          (document.activeElement instanceof HTMLElement &&
            document.activeElement.isContentEditable) ||
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement ||
          document.activeElement instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        toggleTheme()
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [toggleTheme])

  return { toggleTheme }
}
