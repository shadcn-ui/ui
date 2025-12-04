import {
  createSearchParamsCache,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server"
import { iconLibraries, IconLibraryName } from "shadcn/icons"

import { BASE_COLORS, type BaseColor } from "@/registry/base-colors"
import { FONTS, type Font } from "@/registry/fonts"
import { STYLES, type Style } from "@/registry/styles"
import { THEMES, type Theme } from "@/registry/themes"

export const designSystemSearchParams = {
  item: parseAsString.withDefault("cover"),
  iconLibrary: parseAsStringLiteral<IconLibraryName>(
    Object.values(iconLibraries).map((i) => i.name)
  ).withDefault("lucide"),
  style: parseAsStringLiteral<Style["name"]>(
    STYLES.map((s) => s.name)
  ).withDefault("vega"),
  theme: parseAsStringLiteral<Theme["name"]>(
    THEMES.map((t) => t.name)
  ).withDefault("neutral"),
  font: parseAsStringLiteral<Font["value"]>(
    FONTS.map((f) => f.value)
  ).withDefault("inter"),
  baseColor: parseAsStringLiteral<BaseColor["name"]>(
    BASE_COLORS.map((b) => b.name)
  ).withDefault("neutral"),
  accent: parseAsStringLiteral<"subtle" | "bold">([
    "subtle",
    "bold",
  ]).withDefault("subtle"),
  menu: parseAsStringLiteral<"default" | "inverted">([
    "default",
    "inverted",
  ]).withDefault("default"),
  spacing: parseAsStringLiteral<"default" | "compact">([
    "default",
    "compact",
  ]).withDefault("default"),
  radius: parseAsStringLiteral<"none" | "small" | "default" | "large">([
    "none",
    "small",
    "default",
    "large",
  ]).withDefault("default"),
  size: parseAsInteger.withDefault(100),
  custom: parseAsBoolean.withDefault(false),
}

export const designSystemSearchParamsCache = createSearchParamsCache(
  designSystemSearchParams
)

export type DesignSystemSearchParams = Awaited<
  ReturnType<typeof designSystemSearchParamsCache.parse>
>
