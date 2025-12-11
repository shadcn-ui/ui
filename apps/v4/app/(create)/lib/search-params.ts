import {
  createSearchParamsCache,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server"

import {
  BASE_COLORS,
  BASES,
  DEFAULT_CONFIG,
  iconLibraries,
  MENU_ACCENTS,
  MENU_COLORS,
  RADII,
  STYLES,
  THEMES,
  type BaseColorName,
  type BaseName,
  type FontValue,
  type IconLibraryName,
  type MenuAccentValue,
  type MenuColorValue,
  type RadiusValue,
  type StyleName,
  type ThemeName,
} from "@/registry/config"
import { FONTS } from "@/app/(create)/lib/fonts"

export const designSystemSearchParams = {
  base: parseAsStringLiteral<BaseName>(BASES.map((b) => b.name)).withDefault(
    DEFAULT_CONFIG.base
  ),
  item: parseAsString.withDefault("preview"),
  iconLibrary: parseAsStringLiteral<IconLibraryName>(
    Object.values(iconLibraries).map((i) => i.name)
  ).withDefault(DEFAULT_CONFIG.iconLibrary),
  style: parseAsStringLiteral<StyleName>(STYLES.map((s) => s.name)).withDefault(
    DEFAULT_CONFIG.style
  ),
  theme: parseAsStringLiteral<ThemeName>(THEMES.map((t) => t.name)).withDefault(
    DEFAULT_CONFIG.theme
  ),
  font: parseAsStringLiteral<FontValue>(FONTS.map((f) => f.value)).withDefault(
    DEFAULT_CONFIG.font
  ),
  baseColor: parseAsStringLiteral<BaseColorName>(
    BASE_COLORS.map((b) => b.name)
  ).withDefault(DEFAULT_CONFIG.baseColor),
  menuAccent: parseAsStringLiteral<MenuAccentValue>(
    MENU_ACCENTS.map((a) => a.value)
  ).withDefault(DEFAULT_CONFIG.menuAccent),
  menuColor: parseAsStringLiteral<MenuColorValue>(
    MENU_COLORS.map((m) => m.value)
  ).withDefault(DEFAULT_CONFIG.menuColor),
  radius: parseAsStringLiteral<RadiusValue>(
    RADII.map((r) => r.name)
  ).withDefault("default"),
  template: parseAsStringLiteral<"next" | "start" | "vite">([
    "next",
    "start",
    "vite",
  ]).withDefault("next"),
  size: parseAsInteger.withDefault(100),
  custom: parseAsBoolean.withDefault(false),
}

export const designSystemSearchParamsCache = createSearchParamsCache(
  designSystemSearchParams
)

export type DesignSystemSearchParams = Awaited<
  ReturnType<typeof designSystemSearchParamsCache.parse>
>
