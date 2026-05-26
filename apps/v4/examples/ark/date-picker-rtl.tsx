"use client"

import { Button } from "@/examples/ark/ui-rtl/button"
import {
  DatePicker,
  DatePickerContent,
  DatePickerControl,
  DatePickerDayView,
  DatePickerMonthView,
  DatePickerTrigger,
  DatePickerValueText,
  DatePickerYearView,
} from "@/examples/ark/ui-rtl/date-picker"
import { ChevronDownIcon } from "lucide-react"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      placeholder: "Pick a date",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      placeholder: "\u0627\u062E\u062A\u0631 \u062A\u0627\u0631\u064A\u062E\u064B\u0627",
    },
  },
  he: {
    dir: "rtl",
    values: {
      placeholder: "\u05D1\u05D7\u05E8 \u05EA\u05D0\u05E8\u05D9\u05DA",
    },
  },
}

const localeMap: Record<string, string> = {
  en: "en-US",
  ar: "ar-SA",
  he: "he-IL",
}

export function DatePickerRtl() {
  const { dir, t, language } = useTranslation(translations, "ar")

  return (
    <DatePicker
      locale={localeMap[language] || "en-US"}
      dir={dir as "ltr" | "rtl"}
      closeOnSelect
    >
      <DatePickerControl>
        <DatePickerTrigger asChild>
          <Button
            variant="outline"
            className="w-[212px] justify-between text-left font-normal"
          >
            <DatePickerValueText placeholder={t.placeholder} />
            <ChevronDownIcon className="size-4 text-muted-foreground" />
          </Button>
        </DatePickerTrigger>
      </DatePickerControl>
      <DatePickerContent>
        <DatePickerDayView />
        <DatePickerMonthView />
        <DatePickerYearView />
      </DatePickerContent>
    </DatePicker>
  )
}
