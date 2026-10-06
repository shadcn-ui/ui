import { useQueryStates } from "nuqs"
import {
  createLoader,
  createSerializer,
  parseAsStringLiteral,
  type inferParserType,
  type Options,
} from "nuqs/server"

import { AVAILABLE_CONTENT_OPTIONS } from "@/app/(app)/(typeset)/lib/fixtures"
import { FONTS } from "@/app/(app)/(typeset)/lib/fonts"

export const TYPESET_PARAMS_MESSAGE = "typeset-params"

export const TYPESET_SIZES = [
  { value: "14", label: "14px" },
  { value: "15", label: "15px" },
  { value: "16", label: "16px" },
  { value: "18", label: "18px" },
] as const

export const TYPESET_LEADINGS = [
  { value: "1.6", label: "Tight (1.6)" },
  { value: "1.75", label: "Regular (1.75)" },
  { value: "1.9", label: "Loose (1.9)" },
] as const

export const TYPESET_FLOWS = [
  { value: "1em", label: "Compact (1em)" },
  { value: "1.25em", label: "Regular (1.25em)" },
  { value: "2em", label: "Airy (2em)" },
] as const

export const TYPESET_MEASURES = [
  { value: "60", label: "60ch", width: "28em" },
  { value: "70", label: "70ch", width: "33em" },
  { value: "80", label: "80ch", width: "37em" },
  { value: "90", label: "90ch", width: "42em" },
] as const

// The one source of truth for what each param accepts. The parsers, the
// history restorer, and the picker coercion all read from here.
const TYPESET_PARAM_VALUES = {
  body: FONTS.map((font) => font.id),
  heading: ["inherit", ...FONTS.map((font) => font.id)],
  mono: FONTS.map((font) => font.id),
  scale: TYPESET_SIZES.map((option) => option.value),
  measure: TYPESET_MEASURES.map((option) => option.value),
  flow: TYPESET_FLOWS.map((option) => option.value),
  leading: TYPESET_LEADINGS.map((option) => option.value),
  item: AVAILABLE_CONTENT_OPTIONS.map((option) => option.value),
}

const typesetSearchParams = {
  body: parseAsStringLiteral(TYPESET_PARAM_VALUES.body).withDefault("geist"),
  heading: parseAsStringLiteral(TYPESET_PARAM_VALUES.heading).withDefault(
    "inherit"
  ),
  mono: parseAsStringLiteral(TYPESET_PARAM_VALUES.mono).withDefault(
    "geist-mono"
  ),
  scale: parseAsStringLiteral(TYPESET_PARAM_VALUES.scale).withDefault("15"),
  measure: parseAsStringLiteral(TYPESET_PARAM_VALUES.measure).withDefault("80"),
  flow: parseAsStringLiteral(TYPESET_PARAM_VALUES.flow).withDefault("1.25em"),
  leading: parseAsStringLiteral(TYPESET_PARAM_VALUES.leading).withDefault(
    "1.75"
  ),
  item: parseAsStringLiteral(TYPESET_PARAM_VALUES.item).withDefault("docs"),
}

export const loadTypesetSearchParams = createLoader(typesetSearchParams)

export const serializeTypesetSearchParams =
  createSerializer(typesetSearchParams)

export type TypesetSearchParams = inferParserType<typeof typesetSearchParams>

export const TYPESET_PARAM_KEYS = Object.keys(
  typesetSearchParams
) as (keyof TypesetSearchParams)[]

// Narrows a raw string to the param's literal union, or null if invalid.
export function coerceTypesetValue<K extends keyof TypesetSearchParams>(
  key: K,
  value: string
) {
  return (TYPESET_PARAM_VALUES[key] as readonly string[]).includes(value)
    ? (value as TypesetSearchParams[K])
    : null
}

// History snapshots restore through here: values are validated against the
// param model, unknown keys are dropped, and absent keys become null so
// defaults clear.
export function parseTypesetSnapshot(raw: string) {
  let parsed: Record<string, unknown> = {}
  try {
    const json: unknown = JSON.parse(raw)
    if (json && typeof json === "object" && !Array.isArray(json)) {
      parsed = json as Record<string, unknown>
    }
  } catch {
    // Malformed entries restore as all-null, clearing back to defaults.
  }
  const snapshot: Record<string, string | null> = {}
  for (const key of TYPESET_PARAM_KEYS) {
    const value = parsed[key]
    snapshot[key] =
      typeof value === "string" ? coerceTypesetValue(key, value) : null
  }
  return snapshot as {
    [K in keyof TypesetSearchParams]: TypesetSearchParams[K] | null
  }
}

export function useTypesetSearchParams(options: Options = {}) {
  return useQueryStates(typesetSearchParams, {
    shallow: true,
    history: "replace",
    ...options,
  })
}
