import {
  iconLibraries,
  type IconLibrary,
  type IconLibraryName,
} from "shadcn/icons"
import { z } from "zod"

import { BASE_COLORS, type BaseColor } from "@/registry/base-colors"
import { BASES, type Base } from "@/registry/bases"
import { STYLES, type Style } from "@/registry/styles"
import { THEMES, type Theme } from "@/registry/themes"
import { FONTS, type Font } from "@/app/(design)/lib/fonts"

// 🚨 Remove before merging to main.
const SHADCN_VERSION = "file:~/Code/shadcn/ui/packages/shadcn"

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

export const MENU_ACCENTS = [
  { value: "subtle", label: "Subtle" },
  { value: "bold", label: "Bold" },
] as const

export type MenuAccent = (typeof MENU_ACCENTS)[number]
export type MenuAccentValue = MenuAccent["value"]

export const MENU_COLORS = [
  { value: "default", label: "Default" },
  { value: "inverted", label: "Inverted" },
] as const

export type MenuColor = (typeof MENU_COLORS)[number]

export type MenuColorValue = MenuColor["value"]

export const SPACINGS = [
  { value: "default", label: "Default" },
  { value: "compact", label: "Compact" },
] as const

export type Spacing = (typeof SPACINGS)[number]

export type SpacingValue = Spacing["value"]

export const RADII = [
  { value: "default", label: "Default" },
  { value: "none", label: "None" },
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
] as const

export type Radius = (typeof RADII)[number]

export type RadiusValue = Radius["value"]

export const designSystemConfigSchema = z
  .object({
    base: z.enum(BASES.map((b) => b.name) as [BaseName, ...BaseName[]]),
    style: z.enum(STYLES.map((s) => s.name) as [StyleName, ...StyleName[]]),
    iconLibrary: z.enum(
      Object.keys(iconLibraries) as [IconLibraryName, ...IconLibraryName[]]
    ),
    baseColor: z
      .enum(
        BASE_COLORS.map((c) => c.name) as [BaseColorName, ...BaseColorName[]]
      )
      .default("neutral"),
    theme: z.enum(THEMES.map((t) => t.name) as [ThemeName, ...ThemeName[]]),
    font: z
      .enum(FONTS.map((f) => f.value) as [FontValue, ...FontValue[]])
      .default("inter"),
    menuAccent: z
      .enum(
        MENU_ACCENTS.map((a) => a.value) as [
          MenuAccentValue,
          ...MenuAccentValue[],
        ]
      )
      .default("subtle"),
    menuColor: z
      .enum(
        MENU_COLORS.map((m) => m.value) as [MenuColorValue, ...MenuColorValue[]]
      )
      .default("default"),
    spacing: z
      .enum(SPACINGS.map((s) => s.value) as [SpacingValue, ...SpacingValue[]])
      .default("default"),
    radius: z
      .enum(RADII.map((r) => r.value) as [RadiusValue, ...RadiusValue[]])
      .default("default"),
  })
  .refine(
    (data) => {
      const availableThemes = getThemesForBaseColor(data.baseColor)
      return availableThemes.some((t) => t.name === data.theme)
    },
    (data) => ({
      message: `Theme "${data.theme}" is not available for base color "${data.baseColor}"`,
      path: ["theme"],
    })
  )

export type DesignSystemConfig = z.infer<typeof designSystemConfigSchema>

export const DEFAULT_CONFIG: DesignSystemConfig = {
  base: "radix",
  style: "vega",
  baseColor: "neutral",
  theme: "neutral",
  iconLibrary: "lucide",
  font: "inter",
  menuAccent: "subtle",
  menuColor: "default",
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
    menuAccent: "subtle",
    menuColor: "default",
    spacing: "default",
    radius: "medium",
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
    menuAccent: "bold",
    menuColor: "inverted",
    spacing: "compact",
    radius: "medium",
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
    menuAccent: "subtle",
    menuColor: "default",
    spacing: "default",
    radius: "medium",
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

  // Apply menu accent transformation.
  if (config.menuAccent === "bold") {
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
  if (config.radius && config.radius !== "default") {
    const radiusValues: Record<Exclude<RadiusValue, "default">, string> = {
      none: "0",
      small: "0.45rem",
      medium: "0.625rem",
      large: "0.875rem",
    }
    lightVars.radius = radiusValues[config.radius]
  }

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

// Builds a registry:base item from a design system config.
export function buildRegistryBase(config: DesignSystemConfig) {
  const baseItem = getBase(config.base)
  const iconLibraryItem = getIconLibrary(config.iconLibrary)

  if (!baseItem || !iconLibraryItem) {
    throw new Error(
      `Base "${config.base}" or icon library "${config.iconLibrary}" not found`
    )
  }

  const registryTheme = buildRegistryTheme(config)

  // Build dependencies.
  const dependencies = [
    `shadcn@${SHADCN_VERSION}`,
    "class-variance-authority",
    "tw-animate-css",
    ...(baseItem.dependencies ?? []),
    ...iconLibraryItem.packages,
  ]

  const registryDependencies = ["utils"]

  if (config.font) {
    registryDependencies.push(`font-${config.font}`)
  }

  return {
    name: `${config.base}-${config.style}`,
    extends: "none",
    type: "registry:base" as const,
    config: {
      style: `${config.base}-${config.style}`,
      iconLibrary: iconLibraryItem.name,
      menuColor: config.menuColor,
      menuAccent: config.menuAccent,
      tailwind: {
        baseColor: config.baseColor,
      },
    },
    dependencies,
    registryDependencies,
    cssVars: registryTheme.cssVars,
    css: {
      '@import "tw-animate-css"': {},
      '@import "shadcn/tailwind.css"': {},
      "@layer base": {
        "*": { "@apply border-border outline-ring/50": {} },
        body: { "@apply bg-background text-foreground": {} },
      },
    },
  }
}
