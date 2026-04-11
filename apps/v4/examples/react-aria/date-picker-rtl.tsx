"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { type CalendarDate, getLocalTimeZone } from "@internationalized/date"
import { I18nProvider } from "react-aria-components"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"
import { Button } from "@/styles/react-aria-nova/ui-rtl/button"
import { Calendar } from "@/styles/react-aria-nova/ui-rtl/calendar"
import {
  Popover,
  PopoverTrigger,
} from "@/styles/react-aria-nova/ui-rtl/popover"

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

export function DatePickerRtl() {
  const { dir, t, language } = useTranslation(translations, "ar")
  const [date, setDate] = React.useState<CalendarDate | null>(null)

  return (
    <PopoverTrigger>
      <Button
        variant={"outline"}
        data-empty={!date}
        className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        dir={dir}
      >
        {date ? date.toDate(getLocalTimeZone()).toLocaleDateString(language, {dateStyle: 'long'}) : <span>{t.placeholder}</span>}
        <ChevronDownIcon data-icon="inline-end" />
      </Button>
      <Popover className="w-auto p-0" align="start" dir={dir}>
        <I18nProvider locale={language}>
          <Calendar
            value={date}
            onChange={setDate}
          />
        </I18nProvider>
      </Popover>
    </PopoverTrigger>
  )
}
