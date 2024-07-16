"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { THEMES, Theme } from "@/lib/themes"
import { cn } from "@/lib/utils"
import { useThemesConfig } from "@/hooks/use-themes-config"
import { Skeleton } from "@/registry/new-york/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip"

export function ThemesSwitcher({
  themes = THEMES,
  className,
}: React.ComponentProps<"div"> & { themes?: Theme[] }) {
  const { theme: mode } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const { themesConfig, setThemesConfig } = useThemesConfig()
  const activeTheme = themesConfig.activeTheme

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-0.5 py-4 lg:flex-col lg:justify-start lg:gap-1",
          className
        )}
      >
        {THEMES.map((theme) => (
          <div
            key={theme.id}
            className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-transparent"
          >
            <Skeleton className="h-6 w-6 rounded-sm" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-0.5 py-4 lg:flex-col lg:justify-start lg:gap-1",
        className
      )}
    >
      {themes.map((theme) => {
        const isActive = theme.name === activeTheme.name
        const isDarkTheme = ["Midnight"].includes(theme.name)
        const cssVars =
          mounted && mode === "dark" ? theme.cssVars.dark : theme.cssVars.light
        return (
          <Tooltip key={theme.name}>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  console.log({ theme })
                  return setThemesConfig({
                    ...themesConfig,
                    activeTheme: theme,
                  })
                }}
                className={cn(
                  "group flex h-10 w-10 items-center justify-center rounded-lg border-2",
                  isActive ? "border-[--color-1]" : "border-transparent",
                  mounted && isDarkTheme && mode !== "dark" ? "invert-[1]" : ""
                )}
                style={
                  {
                    ...cssVars,
                    "--color-1": "hsl(var(--chart-1))",
                    "--color-2": "hsl(var(--chart-2))",
                    "--color-3": "hsl(var(--chart-3))",
                    "--color-4": "hsl(var(--chart-4))",
                  } as React.CSSProperties
                }
              >
                <div className="h-6 w-6 overflow-hidden rounded-sm">
                  <div
                    className={cn(
                      "grid h-12 w-12 -translate-x-1/4 -translate-y-1/4 grid-cols-2 overflow-hidden rounded-md transition-all ease-in-out group-hover:rotate-45",
                      isActive ? "rotate-45 group-hover:rotate-0" : "rotate-0"
                    )}
                  >
                    <span className="flex h-6 w-6 bg-[--color-1]" />
                    <span className="flex h-6 w-6 bg-[--color-2]" />
                    <span className="flex h-6 w-6 bg-[--color-3]" />
                    <span className="flex h-6 w-6 bg-[--color-4]" />
                    <span className="sr-only">{theme.name}</span>
                  </div>
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black text-white">
              {theme.name}
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
