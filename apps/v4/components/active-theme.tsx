"use client"

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { hex2oklch } from "colorizr"

import { generateThemeFromPrimary } from "@/lib/generate-custom-theme-from-primary"

const DEFAULT_THEME = "default"
const DEFAULT_CUSTOM_COLOR = "#c800de";

type ThemeContextType = {
  activeTheme: string
  setActiveTheme: (theme: string) => void
  customColor: string
  setCustomColor: (color: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ActiveThemeProvider({
  children,
  initialTheme,
  initialCustomColor,
}: {
  children: ReactNode
  initialTheme?: string
  initialCustomColor?: string
}) {
  const [activeTheme, setActiveTheme] = useState<string>(
    () => initialTheme || DEFAULT_THEME
  )

  const [customColor, setCustomColor] = useState<string>(
    () => initialCustomColor || DEFAULT_CUSTOM_COLOR
  )

  useEffect(() => {
    console.log("use effect started");
    Array.from(document.body.classList)
      .filter((className) => className.startsWith("theme-"))
      .forEach((className) => {
        document.body.classList.remove(className)
      })
    document.body.classList.add(`theme-${activeTheme}`)
    if (activeTheme.endsWith("-scaled")) {
      document.body.classList.add("theme-scaled")
    }
    console.log("active theme is : ", activeTheme)
    if (activeTheme.endsWith("custom")) {
      const oklch = hex2oklch(customColor)
      const customTheme = generateThemeFromPrimary(oklch)
      Object.entries(customTheme).forEach(([key, value]) => {
        console.log("key and value are :", key, value);
        document.body.style.setProperty(key, value)
      })
    }
  }, [activeTheme, customColor])

  return (
    <ThemeContext.Provider
      value={{ activeTheme, setActiveTheme, customColor, setCustomColor }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeConfig() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeConfig must be used within an ActiveThemeProvider")
  }
  return context
}
