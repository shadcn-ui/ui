"use client"

import * as React from "react"

import { CHART_THEMES, ChartTheme } from "@/lib/chart-themes"
import { themeColorsToCssVariables } from "@/lib/charts"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip"

export function ChartsToolbar({ className }: React.ComponentProps<"div">) {
  const [activeTheme, setActiveTheme] = React.useState<ChartTheme>(
    CHART_THEMES[1]
  )

  const cssVars = React.useMemo(() => {
    const { colors } = activeTheme
    const cssVars = themeColorsToCssVariables(colors)

    for (const key of Array.from({ length: 5 }, (_, index) => index)) {
      cssVars[`--chart${key + 1}`] = `hsl(${
        cssVars[`--chart${key + 1}`] ||
        `${cssVars["--primary"]} / ${100 - key * 20}%`
      })`
    }

    return {
      light: {
        ...cssVars,
        "--color-desktop": cssVars["--chart1"],
        "--color-mobile": cssVars["--chart3"],
        "--color-visitors": cssVars["--chart1"],
        "--color-chrome": cssVars["--chart1"],
        "--color-safari": cssVars["--chart2"],
        "--color-firefox": cssVars["--chart3"],
        "--color-edge": cssVars["--chart4"],
        "--color-other": cssVars["--chart5"],
        "--color-january": cssVars["--chart1"],
        "--color-february": cssVars["--chart2"],
        "--color-march": cssVars["--chart3"],
        "--color-april": cssVars["--chart4"],
        "--color-may": cssVars["--chart5"],
      },
      dark: {
        ...cssVars,
      },
    }
  }, [activeTheme])

  return (
    <>
      <div className={cn("flex flex-col items-center gap-3", className)}>
        {CHART_THEMES.map((theme) => (
          <Tooltip key={theme.name}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setActiveTheme(theme)}
                className={cn(
                  "flex h-4 w-4 rounded-sm bg-[--color] ring-2 ring-offset-4 ring-offset-background",
                  theme.name === activeTheme.name
                    ? "ring-[--color]"
                    : "ring-transparent"
                )}
                style={
                  {
                    "--color": `hsl(${theme.colors.primary})`,
                    "--background": `hsl(${theme.colors.background})`,
                  } as React.CSSProperties
                }
              >
                <span className="sr-only">{theme.name}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black text-white">
              {theme.name}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <style>
        {`
          .chart-wrapper,
          [data-chart] {
            ${Object.entries(cssVars["light"])
              .map(([key, value]) => `${key}: ${value};`)
              .join("\n")}
          }

          .dark .chart-wrapper,
          .dark [data-chart] {
            ${Object.entries(cssVars["dark"])
              .map(([key, value]) => `${key}: ${value};`)
              .join("\n")}
          }
        `}
      </style>
    </>
  )
}
