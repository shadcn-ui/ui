import * as React from "react"
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
import { decodePreset, encodePreset, isPresetCode } from "shadcn/preset"

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

const designSystemSearchParams = {
  preset: parseAsString.withDefault("a0"),
  base: parseAsStringLiteral<BaseName>(BASES.map((b) => b.name)).withDefault(
    DEFAULT_CONFIG.base
  ),
  item: parseAsString.withDefault("preview").withOptions({ shallow: true }),
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
  size: parseAsInteger.withDefault(100),
  custom: parseAsBoolean.withDefault(false),
}

// Design system param keys that get encoded into the preset code.
const DESIGN_SYSTEM_KEYS = [
  "style",
  "baseColor",
  "theme",
  "iconLibrary",
  "font",
  "radius",
  "menuAccent",
  "menuColor",
] as const

// Non-design-system keys that get passed through as-is.
// `base` is not encoded in preset codes — it's an architectural choice, not visual.
const NON_DESIGN_SYSTEM_KEYS = [
  "base",
  "item",
  "preset",
  "template",
  "rtl",
  "size",
  "custom",
] as const

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
  if (
    params.menuAccent === "bold" &&
    isTranslucentMenuColor(params.menuColor)
  ) {
    return {
      ...params,
      menuAccent: "subtle",
    }
  }

  return params
}

// Wraps nuqs useQueryStates with transparent preset encoding/decoding.
// - Reads: if ?preset=CODE is in the URL, decodes it and returns individual values.
// - Writes: when design system params are set, encodes them into a preset code.
export function useDesignSystemSearchParams(options: Options = {}) {
  const [rawParams, rawSetParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
    ...options,
  })

  // If preset param exists, decode it and overlay on raw params.
  const params = React.useMemo(
    () =>
      rawParams.preset && isPresetCode(rawParams.preset)
        ? normalizeDesignSystemParams({
            ...rawParams,
            ...(decodePreset(rawParams.preset) ?? {}),
          })
        : normalizeDesignSystemParams(rawParams),
    [rawParams]
  )

  // Use ref so setParams callback stays stable across renders.
  const paramsRef = React.useRef(params)
  React.useEffect(() => {
    paramsRef.current = params
  }, [params])

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

      // Encode design system fields into a preset code.
      // Cast needed: merged values may include null from nuqs resets,
      // but encodePreset handles missing values by falling back to defaults.
      const code = encodePreset({
        style: merged.style ?? undefined,
        baseColor: merged.baseColor ?? undefined,
        theme: merged.theme ?? undefined,
        iconLibrary: merged.iconLibrary ?? undefined,
        font: merged.font ?? undefined,
        radius: merged.radius ?? undefined,
        menuAccent: merged.menuAccent ?? undefined,
        menuColor: merged.menuColor ?? undefined,
      } as Parameters<typeof encodePreset>[0])

      // Build update: set preset, clear individual DS params from URL.
      const rawUpdate: Record<string, unknown> = { preset: code }
      for (const key of DESIGN_SYSTEM_KEYS) {
        rawUpdate[key] = null
      }

      // Pass through non-DS params that were explicitly in the update.
      for (const key of NON_DESIGN_SYSTEM_KEYS) {
        if (key in resolvedUpdates) {
          rawUpdate[key] = (resolvedUpdates as Record<string, unknown>)[key]
        }
      }

      return rawSetParams(rawUpdate as RawSetParamsInput, setOptions)
    },
    [rawSetParams]
  )

  return [params, setParams] as const
}
