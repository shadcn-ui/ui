"use client"

import * as React from "react"
import { Button } from "@/examples/base/ui-rtl/button"
import { Calendar } from "@/examples/base/ui-rtl/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/examples/base/ui-rtl/popover"
import { format } from "date-fns"
import { arSA, he } from "date-fns/locale"
import { ChevronDownIcon } from "lucide-react"
import {
  arSA as arSADayPicker,
  he as heDayPicker,
} from "react-day-picker/locale"

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
      placeholder: "اختر تاريخًا",
    },
  },
  he: {
    dir: "rtl",
    values: {
      placeholder: "בחר תאריך",
    },
  },
}

const dayPickerLocales = {
  ar: arSADayPicker,
  he: heDayPicker,
} as const

const dateFnsLocales = {
  ar: arSA,
  he: he,
} as const

export function DatePickerRtl() {
  const { dir, t, language } = useTranslation(translations, "ar")
  const [date, setDate] = React.useState<Date>()

  const dateFnsLocale =
    dir === "rtl"
      ? dateFnsLocales[language as keyof typeof dateFnsLocales]
      : undefined
  const dayPickerLocale =
    dir === "rtl"
      ? dayPickerLocales[language as keyof typeof dayPickerLocales]
      : undefined

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant={"outline"}
            data-empty={!date}
            className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
            dir={dir}
          />
        }
      >
        {date ? (
          format(date, "PPP", { locale: dateFnsLocale })
        ) : (
          <span>{t.placeholder}</span>
        )}
        <ChevronDownIcon data-icon="inline-end" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" dir={dir}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={date}
          dir={dir}
          locale={dayPickerLocale}
        />
      </PopoverContent>
    </Popover>
  )
}
