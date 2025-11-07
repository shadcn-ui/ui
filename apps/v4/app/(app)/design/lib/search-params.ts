import {
  createSearchParamsCache,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server"
import { iconLibraries, IconLibraryName } from "shadcn/icons"

import { fonts, type Font } from "@/registry/fonts"
import { styles, type Style } from "@/registry/styles"
import { BASE_COLORS, themes, type Theme } from "@/registry/themes"

export const designSystemSearchParams = {
  item: parseAsString.withDefault("cover-example"),
  iconLibrary: parseAsStringLiteral<IconLibraryName>(
    Object.values(iconLibraries).map((i) => i.name)
  ).withDefault("lucide"),
  style: parseAsStringLiteral<Style["name"]>(
    styles.map((s) => s.name)
  ).withDefault("default"),
  theme: parseAsStringLiteral<Theme["name"]>(
    themes.map((t) => t.name)
  ).withDefault("neutral"),
  font: parseAsStringLiteral<Font["value"]>(
    fonts.map((f) => f.value)
  ).withDefault("inter"),
  baseColor: parseAsStringLiteral<Theme["name"]>(
    BASE_COLORS.map((b) => b.name)
  ).withDefault("neutral"),
}

export const canvaSearchParams = {
  zoom: parseAsFloat.withDefault(0.85),
  scrollLeft: parseAsInteger.withDefault(0),
  scrollTop: parseAsInteger.withDefault(0),
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
