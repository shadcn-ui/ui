import {
  iconLibraries,
  type IconLibrary,
  type IconLibraryName,
} from "shadcn/icons"

import { BASE_COLORS, type BaseColor } from "@/registry/base-colors"
import { BASES, type Base } from "@/registry/bases"
import { FONTS, type Font } from "@/registry/fonts"
import { STYLES, type Style } from "@/registry/styles"
import { THEMES, type Theme } from "@/registry/themes"

export { BASES, type Base }
export { STYLES, type Style }
export { THEMES, type Theme }
export { BASE_COLORS, type BaseColor }
export { FONTS, type Font }
export { iconLibraries, type IconLibrary, type IconLibraryName }

export type BaseName = Base["name"]
export type StyleName = Style["name"]
export type ThemeName = Theme["name"]
export type BaseColorName = BaseColor["name"]
export type FontValue = Font["value"]

export const ACCENTS = [
  { value: "subtle", label: "Subtle" },
  { value: "bold", label: "Bold" },
] as const

export type Accent = (typeof ACCENTS)[number]
export type AccentValue = Accent["value"]

export const MENUS = [
  { value: "default", label: "Default" },
  { value: "inverted", label: "Inverted" },
] as const

export type Menu = (typeof MENUS)[number]

export type MenuValue = Menu["value"]

export const SPACINGS = [
  { value: "default", label: "Default" },
  { value: "compact", label: "Compact" },
] as const

export type Spacing = (typeof SPACINGS)[number]

export type SpacingValue = Spacing["value"]

export const RADII = [
  { value: "none", label: "None" },
  { value: "small", label: "Small" },
  { value: "default", label: "Default" },
  { value: "large", label: "Large" },
] as const

export type Radius = (typeof RADII)[number]

export type RadiusValue = Radius["value"]

export type DesignSystemConfig = {
  base: BaseName
  style: StyleName
  baseColor: BaseColorName
  theme: ThemeName
  iconLibrary: IconLibraryName
  font: FontValue
  accent: AccentValue
  menu: MenuValue
  spacing: SpacingValue
  radius: RadiusValue
}

export const DEFAULT_CONFIG: DesignSystemConfig = {
  base: "radix",
  style: "vega",
  baseColor: "neutral",
  theme: "neutral",
  iconLibrary: "lucide",
  font: "inter",
  accent: "subtle",
  menu: "default",
  spacing: "default",
  radius: "default",
}

export type Preset = {
  title: string
  description: string
} & DesignSystemConfig

export const PRESETS: Preset[] = [
  {
    title: "Vega",
    description: "Vega / Lucide / Inter",
    base: "radix",
    style: "vega",
    baseColor: "neutral",
    theme: "neutral",
    iconLibrary: "lucide",
    font: "inter",
    accent: "subtle",
    menu: "default",
    spacing: "default",
    radius: "default",
  },
  {
    title: "Vega (Compact)",
    description: "Vega / Lucide / Inter",
    base: "radix",
    style: "vega",
    baseColor: "neutral",
    theme: "blue",
    iconLibrary: "hugeicons",
    font: "geist-sans",
    accent: "bold",
    menu: "inverted",
    spacing: "compact",
    radius: "default",
  },
  {
    title: "Nova",
    description: "Nova / Hugeicons / Figtree",
    base: "radix",
    style: "nova",
    baseColor: "neutral",
    theme: "blue",
    iconLibrary: "hugeicons",
    font: "figtree",
    accent: "subtle",
    menu: "default",
    spacing: "default",
    radius: "default",
  },
]

export function getThemesForBaseColor(baseColorName: string) {
  const baseColorNames = BASE_COLORS.map((bc) => bc.name)

  return THEMES.filter((theme) => {
    if (theme.name === baseColorName) {
      return true
    }
    return !baseColorNames.includes(theme.name)
  })
}

export function getBase(name: BaseName) {
  return BASES.find((base) => base.name === name)
}

export function getStyle(name: StyleName) {
  return STYLES.find((style) => style.name === name)
}

export function getTheme(name: ThemeName) {
  return THEMES.find((theme) => theme.name === name)
}

export function getBaseColor(name: BaseColorName) {
  return BASE_COLORS.find((color) => color.name === name)
}

export function getIconLibrary(name: IconLibraryName) {
  return iconLibraries[name]
}

export function getFont(value: FontValue) {
  return FONTS.find((font) => font.value === value)
}

// Builds a registry:theme item from a design system config.
export function buildRegistryTheme(config: DesignSystemConfig) {
  const baseColor = getBaseColor(config.baseColor)
  const theme = getTheme(config.theme)

  if (!baseColor || !theme) {
    throw new Error(
      `Base color "${config.baseColor}" or theme "${config.theme}" not found`
    )
  }

  // Merge base color and theme CSS vars.
  const lightVars: Record<string, string> = {
    ...(baseColor.cssVars?.light as Record<string, string>),
    ...(theme.cssVars?.light as Record<string, string>),
  }
  const darkVars: Record<string, string> = {
    ...(baseColor.cssVars?.dark as Record<string, string>),
    ...(theme.cssVars?.dark as Record<string, string>),
  }
  const themeVars: Record<string, string> = {}

  // Apply accent transformation.
  if (config.accent === "bold") {
    lightVars.accent = lightVars.primary
    lightVars["accent-foreground"] = lightVars["primary-foreground"]
    darkVars.accent = darkVars.primary
    darkVars["accent-foreground"] = darkVars["primary-foreground"]
  }

  // Apply spacing transformation.
  if (config.spacing === "compact") {
    themeVars.spacing = "0.20835rem"
    themeVars["text-xs"] = "11px"
    themeVars["text-sm"] = "13px"
    themeVars["text-base"] = "15px"
    themeVars["text-lg"] = "17px"
    themeVars["text-xl"] = "19px"
    themeVars["text-xs--line-height"] = "calc(1 / 0.6875rem)"
    themeVars["text-sm--line-height"] = "calc(1.25 / 0.8125rem)"
    themeVars["text-base--line-height"] = "calc(1.5 / 0.9375rem)"
    themeVars["text-lg--line-height"] = "calc(1.75 / 1.0625rem)"
    themeVars["text-xl--line-height"] = "calc(1.75 / 1.1875rem)"
  }

  // Apply radius transformation.
  const radiusValues: Record<RadiusValue, string> = {
    none: "0",
    small: "0.45rem",
    default: "0.625rem",
    large: "0.875rem",
  }
  lightVars.radius = radiusValues[config.radius]

  return {
    name: `${config.baseColor}-${config.theme}`,
    type: "registry:theme" as const,
    cssVars: {
      theme: Object.keys(themeVars).length > 0 ? themeVars : undefined,
      light: lightVars,
      dark: darkVars,
    },
  }
}
