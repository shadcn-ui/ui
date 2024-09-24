import { useAtom } from "jotai"
import { atomWithStorage, createJSONStorage } from "jotai/utils"

import { BaseColor, baseColors } from "@/registry/registry-base-colors"
import { Style } from "@/registry/registry-styles"

export interface ConfigThemeCssVars {
  background: string
  foreground: string
  card: string
  "card-foreground": string
  popover: string
  "popover-foreground": string
  primary: string
  "primary-foreground": string
  secondary: string
  "secondary-foreground": string
  muted: string
  "muted-foreground": string
  accent: string
  "accent-foreground": string
  destructive: string
  "destructive-foreground": string
  border: string
  input: string
  ring: string
}

export type ConfigThemeCssVarsKey = keyof ConfigThemeCssVars

export type Config = {
  style: Style["name"]
  theme: BaseColor["name"]
  // light and dark can be undefined for existing users who have
  // a saved config without these values
  light: ConfigThemeCssVars
  dark: ConfigThemeCssVars
  wcagOpen: boolean
  radius: number
}

const configAtom = atomWithStorage<Config>(
  "config",
  {
    style: "default",
    theme: "zinc",
    light: baseColors.find((color) => color.name === "zinc")!.cssVars.light,
    dark: baseColors.find((color) => color.name === "zinc")!.cssVars.dark,
    wcagOpen: false,
    radius: 0.5,
  },
  createJSONStorage(() => {
    // custom json storage to populate light and dark theme for
    // users who have a saved localStorage object
    const parsedJson = JSON.parse(localStorage.getItem("config") || "{}")
    if (!parsedJson.light && parsedJson.theme) {
      // we don't have the light and dark theme values
      let selectedTheme = baseColors.find(
        (color) => color.name === parsedJson.theme
      )
      if (!selectedTheme) {
        // we couldn't find the saved theme, default to zinc
        selectedTheme = baseColors.find((color) => color.name === "zinc")!
        parsedJson.theme = "zinc"
      }
      parsedJson.light = selectedTheme.cssVars.light
      parsedJson.dark = selectedTheme.cssVars.dark
      if (parsedJson.wcagOpen === undefined) {
        parsedJson.wcagOpen = false
      }
      localStorage.setItem("config", JSON.stringify(parsedJson))
    }
    return localStorage
  })
)

export function useConfig() {
  return useAtom(configAtom)
}
