"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

const COLOR_PALETTE = [
  "#3b82f6",
  "#f43f5e",
  "#00f03f",
  "#f97316",
  "#9d7e55",
  "#82bd69",
  "#c6afa3",
]

export function ChartsToolbar({ className }: React.ComponentProps<"div">) {
  const [BASE_LIGHT, setBaseLight] = React.useState("#3b82f6")
  const [BASE_DARK, setBaseDark] = React.useState("#a3e635")
  const { theme } = useTheme()

  return (
    <>
      <div className={cn("flex flex-col items-center gap-2", className)}>
        {COLOR_PALETTE.map((color) => (
          <button
            key={color}
            onClick={() =>
              theme === "dark" ? setBaseDark(color) : setBaseLight(color)
            }
            className="h-4 w-4 shrink-0 rounded-full"
            style={{
              backgroundColor: color,
            }}
          >
            <span className="sr-only">Toggle</span>
          </button>
        ))}
      </div>
      <style>
        {`
          .recharts-wrapper {
            --color-desktop: ${BASE_LIGHT} !important;
            --color-mobile: ${BASE_LIGHT}80 !important;
            --color-chrome: ${BASE_LIGHT} !important;
            --color-safari: ${BASE_LIGHT}CC !important;
            --color-firefox: ${BASE_LIGHT}99 !important;
            --color-edge: ${BASE_LIGHT}80 !important;
            --color-other: ${BASE_LIGHT}66 !important;
          }
          .dark .recharts-wrapper {
            --color-desktop: ${BASE_DARK} !important;
            --color-mobile: ${BASE_DARK}80 !important;
            --color-chrome: ${BASE_DARK} !important;
            --color-safari: ${BASE_DARK}CC !important;
            --color-firefox: ${BASE_DARK}99 !important;
            --color-edge: ${BASE_DARK}80 !important;
            --color-other: ${BASE_DARK}66 !important;
          }
        `}
      </style>
    </>
  )
}
