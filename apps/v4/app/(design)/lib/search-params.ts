import {
  createSearchParamsCache,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server"

import {
  ACCENTS,
  BASE_COLORS,
  DEFAULT_CONFIG,
  FONTS,
  iconLibraries,
  MENUS,
  RADII,
  SPACINGS,
  STYLES,
  THEMES,
  type AccentValue,
  type BaseColorName,
  type FontValue,
  type IconLibraryName,
  type MenuValue,
  type RadiusValue,
  type SpacingValue,
  type StyleName,
  type ThemeName,
} from "@/app/(design)/lib/config"

export const designSystemSearchParams = {
  item: parseAsString.withDefault("cover"),
  iconLibrary: parseAsStringLiteral<IconLibraryName>(
    Object.values(iconLibraries).map((i) => i.name)
  ).withDefault(DEFAULT_CONFIG.iconLibrary),
  style: parseAsStringLiteral<StyleName>(
    STYLES.map((s) => s.name)
  ).withDefault(DEFAULT_CONFIG.style),
  theme: parseAsStringLiteral<ThemeName>(
    THEMES.map((t) => t.name)
  ).withDefault(DEFAULT_CONFIG.theme),
  font: parseAsStringLiteral<FontValue>(
    FONTS.map((f) => f.value)
  ).withDefault(DEFAULT_CONFIG.font),
  baseColor: parseAsStringLiteral<BaseColorName>(
    BASE_COLORS.map((b) => b.name)
  ).withDefault(DEFAULT_CONFIG.baseColor),
  accent: parseAsStringLiteral<AccentValue>(
    ACCENTS.map((a) => a.value)
  ).withDefault(DEFAULT_CONFIG.accent),
  menu: parseAsStringLiteral<MenuValue>(
    MENUS.map((m) => m.value)
  ).withDefault(DEFAULT_CONFIG.menu),
  spacing: parseAsStringLiteral<SpacingValue>(
    SPACINGS.map((s) => s.value)
  ).withDefault(DEFAULT_CONFIG.spacing),
  radius: parseAsStringLiteral<RadiusValue>(
    RADII.map((r) => r.value)
  ).withDefault(DEFAULT_CONFIG.radius),
  size: parseAsInteger.withDefault(100),
  custom: parseAsBoolean.withDefault(false),
}

export const designSystemSearchParamsCache = createSearchParamsCache(
  designSystemSearchParams
)

export type DesignSystemSearchParams = Awaited<
  ReturnType<typeof designSystemSearchParamsCache.parse>
>
