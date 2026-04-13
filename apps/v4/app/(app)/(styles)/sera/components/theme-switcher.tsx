"use client"

import * as React from "react"

import { Button } from "@/registry/new-york-v4/ui/button"

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
    <div className="dark fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="w-full max-w-fit rounded-full border bg-background/80 p-2 shadow-lg backdrop-blur supports-backdrop-filter:bg-background/50">
        <div className="no-scrollbar flex snap-x snap-mandatory items-center gap-2 overflow-x-auto">
          {THEME_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={theme === option.value ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setTheme(option.value)
              }}
              className="snap-center rounded-full text-white data-[variant=default]:text-black"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
