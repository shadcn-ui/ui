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
  const { dir, t } = useTranslation(translations, "ar")
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover dir={dir}>
      <PopoverTrigger
        render={
          <Button
            variant={"outline"}
            data-empty={!date}
            className="data-[empty=true]:text-muted-foreground w-[212px] justify-between text-left font-normal"
            dir={dir}
          />
        }
      >
        {date ? format(date, "PPP") : <span>{t.placeholder}</span>}
        <ChevronDownIcon data-icon="inline-end" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" dir={dir}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={date}
          dir={dir}
        />
      </PopoverContent>
    </Popover>
  )
}
