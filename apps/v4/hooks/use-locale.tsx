"use client"

import * as React from "react"

import {
  LANGUAGE_COOKIE_MAX_AGE,
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  getLocale,
  isLanguage,
  type Language,
} from "@/lib/localization"
import { DirectionProvider as BaseDirectionProvider } from "@/registry/bases/base/ui/direction"
import { DirectionProvider as RadixDirectionProvider } from "@/registry/bases/radix/ui/direction"
import { DirectionProvider as NewYorkDirectionProvider } from "@/registry/new-york-v4/ui/direction"

type LocaleContextValue = ReturnType<typeof getLocale> & {
  isRtl: boolean
  setLanguage: (language: Language) => void
}

const LocaleContext = React.createContext<LocaleContextValue | undefined>(
  undefined
)

function readStoredLanguage() {
  try {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)

    if (isLanguage(storedLanguage)) {
      return storedLanguage
    }
  } catch {
    // Unsupported.
  }

  return undefined
}

function writeStoredLanguage(language: Language) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // Unsupported.
  }

  document.cookie = `${LANGUAGE_STORAGE_KEY}=${language}; path=/; max-age=${LANGUAGE_COOKIE_MAX_AGE}; samesite=lax`
}

function applyLanguage(language: Language) {
  const locale = getLocale(language)
  const root = document.documentElement

  root.lang = locale.lang
  root.dir = locale.dir
  root.dataset.lang = locale.language
}

export function LocaleProvider({
  children,
  defaultLanguage = DEFAULT_LANGUAGE,
}: {
  children: React.ReactNode
  defaultLanguage?: Language
}) {
  const [language, setLanguageState] = React.useState<Language>(defaultLanguage)

  React.useEffect(() => {
    const storedLanguage = readStoredLanguage()

    if (storedLanguage && storedLanguage !== language) {
      setLanguageState(storedLanguage)
      return
    }

    applyLanguage(language)
  }, [language])

  const setLanguage = React.useCallback((nextLanguage: Language) => {
    writeStoredLanguage(nextLanguage)
    setLanguageState(nextLanguage)
    applyLanguage(nextLanguage)
  }, [])

  const locale = React.useMemo(() => getLocale(language), [language])

  const value = React.useMemo(
    () => ({
      ...locale,
      isRtl: locale.dir === "rtl",
      setLanguage,
    }),
    [locale, setLanguage]
  )

  return (
    <LocaleContext.Provider value={value}>
      <BaseDirectionProvider direction={locale.dir}>
        <RadixDirectionProvider dir={locale.dir}>
          <NewYorkDirectionProvider dir={locale.dir}>
            {children}
          </NewYorkDirectionProvider>
        </RadixDirectionProvider>
      </BaseDirectionProvider>
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = React.useContext(LocaleContext)

  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }

  return context
}
