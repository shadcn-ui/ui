import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useQueryStates } from "nuqs"
import {
  createLoader,
  createSerializer,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  type inferParserType,
  type Options,
} from "nuqs/server"
import { decodePreset, isPresetCode } from "shadcn/preset"

import {
  BASE_COLORS,
  BASES,
  DEFAULT_CONFIG,
  getThemesForBaseColor,
  iconLibraries,
  MENU_ACCENTS,
  MENU_COLORS,
  RADII,
  STYLES,
  THEMES,
  type BaseColorName,
  type BaseName,
  type ChartColorName,
  type FontHeadingValue,
  type FontValue,
  type IconLibraryName,
  type MenuAccentValue,
  type MenuColorValue,
  type RadiusValue,
  type StyleName,
  type ThemeName,
} from "@/registry/config"
import { FONTS } from "@/app/(app)/create/lib/fonts"
import { getPresetCode } from "@/app/(app)/create/lib/preset-code"
import { resolvePresetOverrides } from "@/app/(app)/create/lib/preset-query"

const designSystemSearchParams = {
  preset: parseAsString.withDefault("b0"),
  base: parseAsStringLiteral<BaseName>(BASES.map((b) => b.name)).withDefault(
    DEFAULT_CONFIG.base
  ),
  item: parseAsString.withDefault("preview-02").withOptions({ shallow: true }),
  iconLibrary: parseAsStringLiteral<IconLibraryName>(
    Object.values(iconLibraries).map((i) => i.name)
  ).withDefault(DEFAULT_CONFIG.iconLibrary),
  style: parseAsStringLiteral<StyleName>(STYLES.map((s) => s.name)).withDefault(
    DEFAULT_CONFIG.style
  ),
  theme: parseAsStringLiteral<ThemeName>(THEMES.map((t) => t.name)).withDefault(
    DEFAULT_CONFIG.theme
  ),
  chartColor: parseAsStringLiteral<ChartColorName>(
    THEMES.map((t) => t.name)
  ).withDefault(DEFAULT_CONFIG.chartColor ?? "neutral"),
  font: parseAsStringLiteral<FontValue>(FONTS.map((f) => f.value)).withDefault(
    DEFAULT_CONFIG.font
  ),
  fontHeading: parseAsStringLiteral<FontHeadingValue>([
    "inherit",
    ...FONTS.map((f) => f.value),
  ]).withDefault(DEFAULT_CONFIG.fontHeading),
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
  template: parseAsStringLiteral([
    "next",
    "next-monorepo",
    "start",
    "start-monorepo",
    "react-router",
    "react-router-monorepo",
    "vite",
    "vite-monorepo",
    "astro",
    "astro-monorepo",
    "laravel",
  ] as const).withDefault("next"),
  rtl: parseAsBoolean.withDefault(false),
  pointer: parseAsBoolean.withDefault(false),
  size: parseAsInteger.withDefault(100),
  custom: parseAsBoolean.withDefault(false),
}

// Design system param keys that get encoded into the preset code.
const DESIGN_SYSTEM_KEYS = [
  "style",
  "baseColor",
  "theme",
  "chartColor",
  "iconLibrary",
  "font",
  "fontHeading",
  "radius",
  "menuAccent",
  "menuColor",
] as const

function normalizeFontHeading(
  font: FontValue,
  fontHeading: FontHeadingValue
): FontHeadingValue {
  // Persist "same as body" as an explicit inherit sentinel so the body font
  // can change later without freezing headings to a concrete previous value.
  return fontHeading === font ? "inherit" : fontHeading
}

// Non-design-system keys that get passed through as-is.
// `base` is not encoded in preset codes — it's an architectural choice, not visual.
const NON_DESIGN_SYSTEM_KEYS = [
  "base",
  "item",
  "preset",
  "template",
  "rtl",
  "pointer",
  "size",
  "custom",
] as const

// Shared across hook instances so only one mount effect encodes the initial URL.
let hasSyncedPresetToUrl = false

export const loadDesignSystemSearchParams = createLoader(
  designSystemSearchParams
)

export const serializeDesignSystemSearchParams = createSerializer(
  designSystemSearchParams
)

export type DesignSystemSearchParams = inferParserType<
  typeof designSystemSearchParams
>

export function isTranslucentMenuColor(
  menuColor?: MenuColorValue | null
): menuColor is "default-translucent" | "inverted-translucent" {
  return (
    menuColor === "default-translucent" || menuColor === "inverted-translucent"
  )
}

function normalizePartialDesignSystemParams(
  params: Partial<DesignSystemSearchParams>
): Partial<DesignSystemSearchParams> {
  if (
    params.menuAccent === "bold" &&
    isTranslucentMenuColor(params.menuColor ?? undefined)
  ) {
    return {
      ...params,
      menuAccent: "subtle",
    }
  }

  return params
}

function normalizeDesignSystemParams(
  params: DesignSystemSearchParams
): DesignSystemSearchParams {
  let result = {
    ...params,
    fontHeading: normalizeFontHeading(params.font, params.fontHeading),
  }

  // Validate theme and chartColor against baseColor.
  if (result.baseColor) {
    const available = getThemesForBaseColor(result.baseColor)
    const themeValid = available.some((t) => t.name === result.theme)
    const chartColorValid = available.some((t) => t.name === result.chartColor)

    if (!themeValid || !chartColorValid) {
      const fallback = (available[0]?.name ?? result.baseColor) as ThemeName
      result = {
        ...result,
        ...(!themeValid && { theme: fallback }),
        ...(!chartColorValid && { chartColor: fallback as ChartColorName }),
      }
    }
  }

  if (
    result.menuAccent === "bold" &&
    isTranslucentMenuColor(result.menuColor)
  ) {
    return {
      ...result,
      menuAccent: "subtle",
    }
  }

  return result
}

// If preset param exists, decode it and overlay on raw params.
// V1 presets don't encode chartColor — fall back to the colored
// theme that base-color themes originally borrowed charts from.
type SearchParamsLike = Pick<URLSearchParams, "get" | "has">

function resolvePresetParams(
  rawParams: DesignSystemSearchParams,
  searchParams: SearchParamsLike
) {
  if (rawParams.preset && isPresetCode(rawParams.preset)) {
    const decoded = decodePreset(rawParams.preset)
    if (decoded) {
      const presetOverrides = resolvePresetOverrides(searchParams, decoded)
      return normalizeDesignSystemParams({
        ...decoded,
        ...presetOverrides,
        base: rawParams.base,
        item: rawParams.item,
        preset: rawParams.preset,
        template: rawParams.template,
        rtl: rawParams.rtl,
        pointer: rawParams.pointer,
        size: rawParams.size,
        custom: rawParams.custom,
      })
    }
  }
  return normalizeDesignSystemParams(rawParams)
}

export function buildPresetUrlUpdate(
  merged: DesignSystemSearchParams,
  resolvedUpdates: Partial<DesignSystemSearchParams> = {}
) {
  const code = getPresetCode(merged)
  const rawUpdate: Record<string, unknown> = { preset: code }

  for (const key of DESIGN_SYSTEM_KEYS) {
    rawUpdate[key] = null
  }

  for (const key of NON_DESIGN_SYSTEM_KEYS) {
    if (key === "preset") {
      continue
    }

    rawUpdate[key] =
      key in resolvedUpdates
        ? (resolvedUpdates as Record<string, unknown>)[key]
        : merged[key]
  }

  return rawUpdate
}

// Wraps nuqs useQueryStates with transparent preset encoding/decoding.
// - Reads: if ?preset=CODE is in the URL, decodes it and returns individual values.
// - Writes: when design system params are set, encodes them into a preset code.
//
// Default options use shallow: true so picker selections do not trigger a full
// Next.js server navigation. This prevents the customizer panel from flickering
// or resetting while the URL update propagates (#10910, #11060).
export function useDesignSystemSearchParams(options: Options = {}) {
  const searchParams = useSearchParams()
  const [rawParams, rawSetParams] = useQueryStates(designSystemSearchParams, {
    shallow: true,
    history: "push",
    ...options,
  })

  const params = React.useMemo(
    () => resolvePresetParams(rawParams, searchParams),
    [rawParams, searchParams]
  )

  // Use ref so setParams callback stays stable across renders.
  const paramsRef = React.useRef(params)
  React.useEffect(() => {
    paramsRef.current = params
  }, [params])

  React.useEffect(() => {
    if (hasSyncedPresetToUrl || searchParams.has("preset")) {
      return
    }

    hasSyncedPresetToUrl = true

    const merged = normalizeDesignSystemParams(paramsRef.current)
    void rawSetParams(buildPresetUrlUpdate(merged) as RawSetParamsInput, {
      history: "replace",
    })
  }, [rawSetParams, searchParams])

  type RawSetParamsInput = Parameters<typeof rawSetParams>[0]

  const setParams = React.useCallback(
    (
      updates:
        | Partial<DesignSystemSearchParams>
        | ((
            old: DesignSystemSearchParams
          ) => Partial<DesignSystemSearchParams>),
      setOptions?: Options
    ) => {
      const resolvedUpdates = normalizePartialDesignSystemParams(
        typeof updates === "function" ? updates(paramsRef.current) : updates
      )

      const hasDesignSystemUpdate = DESIGN_SYSTEM_KEYS.some(
        (key) => key in resolvedUpdates
      )

      if (!hasDesignSystemUpdate) {
        // No design system change, pass through directly.
        return rawSetParams(resolvedUpdates as RawSetParamsInput, setOptions)
      }

      // Merge current decoded values with updates.
      const merged = normalizeDesignSystemParams({
        ...paramsRef.current,
        ...resolvedUpdates,
      })
      return rawSetParams(
        buildPresetUrlUpdate(merged, resolvedUpdates) as RawSetParamsInput,
        setOptions
      )
    },
    [rawSetParams]
  )

  return [params, setParams] as const
}
