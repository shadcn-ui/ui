"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const THEME_OPTIONS = [
  { label: "Taupe", value: "theme-taupe" },
  { label: "Neutral", value: "theme-neutral" },
  { label: "Stone", value: "theme-stone" },
  { label: "Zinc", value: "theme-zinc" },
  { label: "Mauve", value: "theme-mauve" },
  { label: "Olive", value: "theme-olive" },
  { label: "Mist", value: "theme-mist" },
] as const

const STORAGE_KEY = "sera-theme"
const DEFAULT_THEME = "theme-taupe"

function applyThemeToPreviews(theme: string) {
  const previewElements = document.querySelectorAll<HTMLElement>(".preview")

  previewElements.forEach((element) => {
    THEME_OPTIONS.forEach((option) => {
      element.classList.remove(option.value)
    })

    element.classList.add(theme)
  })
}

export function ThemeSwitcher() {
  const [theme, setTheme] = React.useState<string>(DEFAULT_THEME)

  React.useEffect(() => {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY)

    if (
      savedTheme &&
      THEME_OPTIONS.some((option) => {
        return option.value === savedTheme
      })
    ) {
      setTheme(savedTheme)
      return
    }

    applyThemeToPreviews(DEFAULT_THEME)
  }, [])

  React.useEffect(() => {
    applyThemeToPreviews(theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="w-full max-w-fit rounded-full border-0 bg-neutral-950/80 p-1.5 text-neutral-100 shadow-lg ring-1 ring-neutral-950/80 backdrop-blur-xl dark:bg-neutral-800/90 dark:ring-neutral-700/50">
        <div className="no-scrollbar flex snap-x snap-mandatory items-center gap-1 overflow-x-auto">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setTheme(option.value)
              }}
              className={cn(
                "shrink-0 snap-center rounded-full px-3 py-1.5 text-sm font-medium outline-hidden select-none",
                theme === option.value
                  ? "bg-neutral-600 text-neutral-100 dark:bg-neutral-700/80"
                  : "text-neutral-400 hover:bg-neutral-600 hover:text-neutral-100 dark:hover:bg-neutral-700/80"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
