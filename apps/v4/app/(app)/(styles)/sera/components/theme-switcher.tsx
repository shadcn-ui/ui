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
    applyThemeToPreviews(theme)
  }, [theme])

  return (
    <div className="fixed inset-x-0 bottom-8 z-50 flex justify-center px-4">
      <div className="w-full max-w-[60vw] rounded-full border-0 bg-neutral-950/50 p-1.5 shadow-xl backdrop-blur-xl sm:max-w-fit">
        <div className="no-scrollbar flex snap-x snap-mandatory items-center overflow-x-auto">
          {THEME_OPTIONS.map((option) => (
            <button
              data-active={theme === option.value}
              key={option.value}
              type="button"
              onClick={() => {
                setTheme(option.value)
              }}
              className="shrink-0 snap-center rounded-full px-3 py-1.5 text-sm font-medium text-neutral-300 outline-hidden transition-colors select-none hover:text-neutral-100 data-active:bg-neutral-500 data-active:text-neutral-100"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
