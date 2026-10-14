"use client"

import * as React from "react"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"
import {
  Calendar,
  getLocalTimeZone,
  today,
  type DatePickerValueChangeDetails,
  type DateValue,
} from "@/styles/ark-nova/ui-rtl/calendar"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {},
  },
  ar: {
    dir: "rtl",
    values: {},
  },
  he: {
    dir: "rtl",
    values: {},
  },
}

const locales: Record<string, string> = {
  en: "en-US",
  ar: "ar-SA",
  he: "he-IL",
}

export function CalendarRtl() {
  const { dir, language } = useTranslation(translations, "ar")
  const [value, setValue] = React.useState<DateValue[]>([
    today(getLocalTimeZone()),
  ])

  return (
    <Calendar
      selectionMode="single"
      value={value}
      onValueChange={(details: DatePickerValueChangeDetails) =>
        setValue(details.value)
      }
      className="rounded-lg border [--cell-size:--spacing(9)]"
      dir={dir}
      locale={locales[language] ?? "en-US"}
    />
  )
}
