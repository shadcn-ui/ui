import {
  createSearchParamsCache,
  parseAsFloat,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server"
import { iconLibraries, IconLibraryName } from "shadcn/icons"

import { BASE_COLORS, type BaseColor } from "@/registry/base-colors"
import { FONTS, type Font } from "@/registry/fonts"
import { STYLES, type Style } from "@/registry/styles"
import { THEMES, type Theme } from "@/registry/themes"

export const designSystemSearchParams = {
  item: parseAsString.withDefault("cover-example"),
  iconLibrary: parseAsStringLiteral<IconLibraryName>(
    Object.values(iconLibraries).map((i) => i.name)
  ).withDefault("lucide"),
  style: parseAsStringLiteral<Style["name"]>(
    STYLES.map((s) => s.name)
  ).withDefault("default"),
  theme: parseAsStringLiteral<Theme["name"]>(
    THEMES.map((t) => t.name)
  ).withDefault("neutral"),
  font: parseAsStringLiteral<Font["value"]>(
    FONTS.map((f) => f.value)
  ).withDefault("inter"),
  baseColor: parseAsStringLiteral<BaseColor["name"]>(
    BASE_COLORS.map((b) => b.name)
  ).withDefault("neutral"),
}

export const canvaSearchParams = {
  zoom: parseAsFloat,
}

export const designSystemSearchParamsCache = createSearchParamsCache(
  designSystemSearchParams
)

export const canvaSearchParamsCache = createSearchParamsCache(canvaSearchParams)

export type DesignSystemSearchParams = Awaited<
  ReturnType<typeof designSystemSearchParamsCache.parse>
>

export type CanvaSearchParams = Awaited<
  ReturnType<typeof canvaSearchParamsCache.parse>
>
