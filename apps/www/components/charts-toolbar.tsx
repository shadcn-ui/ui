"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

const COLOR_PALETTE = [
  "#111111",
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

  const cssVars = React.useMemo(() => {
    if (BASE_LIGHT === "colors") {
      return {
        light: {
          "--color-desktop": `#2a9d8f`,
          "--color-mobile": `#e76f51`,
          "--color-chrome": "#264653",
          "--color-safari": "#2a9d8f",
          "--color-firefox": "#e9c46a",
          "--color-edge": "#e76f51",
          "--color-other": "#f4a261",
          "--color-january": "#264653",
          "--color-february": "#2a9d8f",
          "--color-march": "#e9c46a",
          "--color-april": "#e76f51",
          "--color-may": "#f4a261",
        },
        dark: {
          "--color-desktop": `#2a9d8f`,
          "--color-mobile": `#e76f51`,
          "--color-chrome": "#264653",
          "--color-safari": "#2a9d8f",
          "--color-firefox": "#e9c46a",
          "--color-edge": "#e76f51",
          "--color-other": "#f4a261",
          "--color-january": "#264653",
          "--color-february": "#2a9d8f",
          "--color-march": "#e9c46a",
          "--color-april": "#e76f51",
          "--color-may": "#f4a261",
        },
      }
    }
    return {
      light: {
        "--color-desktop": BASE_LIGHT,
        "--color-mobile": `${BASE_LIGHT}80`,
        "--color-chrome": BASE_LIGHT,
        "--color-safari": `${BASE_LIGHT}CC`,
        "--color-firefox": `${BASE_LIGHT}99`,
        "--color-edge": `${BASE_LIGHT}80`,
        "--color-other": `${BASE_LIGHT}66`,
      },
      dark: {
        "--color-desktop": BASE_DARK,
        "--color-mobile": `${BASE_DARK}80`,
        "--color-chrome": BASE_DARK,
        "--color-safari": `${BASE_DARK}CC`,
        "--color-firefox": `${BASE_DARK}99`,
        "--color-edge": `${BASE_DARK}80`,
        "--color-other": `${BASE_DARK}66`,
      },
    }
  }, [BASE_LIGHT, BASE_DARK])

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
        <button
          onClick={() => {
            setBaseLight("colors")
            setBaseDark("colors")
          }}
          className="h-4 w-4 shrink-0 rounded-full bg-gradient-to-l from-sky-400 via-rose-400 to-lime-400"
        >
          <span className="sr-only">Toggle</span>
        </button>
      </div>
      <style>
        {`
          .recharts-wrapper:not(.no-tint) {
            ${Object.entries(cssVars["light"])
              .map(([key, value]) => `${key}: ${value} !important;`)
              .join("\n")}
          }
          .dark .recharts-wrapper:not(.no-tint) {
            ${Object.entries(cssVars["dark"])
              .map(([key, value]) => `${key}: ${value} !important;`)
              .join("\n")}
          }
        `}
      </style>
    </>
  )
}
