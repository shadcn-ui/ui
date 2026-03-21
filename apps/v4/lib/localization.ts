export type Language = "en" | "ar" | "he"

export type Direction = "ltr" | "rtl"

export type LocaleDefinition = {
  language: Language
  lang: string
  dir: Direction
  label: string
}

export type LogicalInlineSide = "left" | "right" | "start" | "end"

export type LogicalSide = "top" | "bottom" | LogicalInlineSide

export const LANGUAGE_STORAGE_KEY = "language"
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export const DEFAULT_LANGUAGE: Language = "en"

export const localeDefinitions: Record<Language, LocaleDefinition> = {
  en: {
    language: "en",
    lang: "en",
    dir: "ltr",
    label: "English",
  },
  ar: {
    language: "ar",
    lang: "ar",
    dir: "rtl",
    label: "Arabic (العربية)",
  },
  he: {
    language: "he",
    lang: "he",
    dir: "rtl",
    label: "Hebrew (עברית)",
  },
}

export const languageOptions = Object.values(localeDefinitions).map(
  ({ language, label }) => ({
    value: language,
    label,
  })
)

export function isLanguage(value: string | null | undefined): value is Language {
  return value === "en" || value === "ar" || value === "he"
}

export function getLocale(language?: string | null): LocaleDefinition {
  if (isLanguage(language)) {
    return localeDefinitions[language]
  }

  return localeDefinitions[DEFAULT_LANGUAGE]
}

export function resolveInlineSide(
  direction: Direction,
  side: LogicalInlineSide
): "left" | "right" {
  if (side === "start") {
    return direction === "rtl" ? "right" : "left"
  }

  if (side === "end") {
    return direction === "rtl" ? "left" : "right"
  }

  return side
}

export function resolveSide(
  direction: Direction,
  side: LogicalSide
): "top" | "bottom" | "left" | "right" {
  if (side === "top" || side === "bottom") {
    return side
  }

  return resolveInlineSide(direction, side)
}
