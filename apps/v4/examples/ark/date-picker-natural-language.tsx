"use client"

import { useState } from "react"
import { parseDate } from "chrono-node"
import {
  DatePicker,
  DatePickerTrigger,
  DatePickerContent,
  DatePickerDayView,
  DatePickerMonthView,
  DatePickerYearView,
  CalendarDate,
} from "@/examples/ark/ui/date-picker"

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export function DatePickerNaturalLanguage() {
  const initialDate = parseDate("In 2 days")
  const [inputValue, setInputValue] = useState("In 2 days")
  const [resolvedDate, setResolvedDate] = useState<Date | undefined>(
    initialDate || undefined
  )
  const [pickerValue, setPickerValue] = useState<CalendarDate[]>(
    initialDate
      ? [
          new CalendarDate(
            initialDate.getFullYear(),
            initialDate.getMonth() + 1,
            initialDate.getDate()
          ),
        ]
      : []
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setInputValue(text)
    const parsed = parseDate(text)
    if (parsed) {
      setResolvedDate(parsed)
      setPickerValue([
        new CalendarDate(
          parsed.getFullYear(),
          parsed.getMonth() + 1,
          parsed.getDate()
        ),
      ])
    }
  }

  return (
    <div className="mx-auto flex max-w-xs flex-col gap-1.5">
      <DatePicker
        value={pickerValue}
        onValueChange={(details) => {
          setPickerValue(details.value)
          const d = details.value[0]
          if (d) {
            const jsDate = new Date(d.year, d.month - 1, d.day)
            setResolvedDate(jsDate)
            setInputValue(formatDate(jsDate))
          }
        }}
      >
        <div className="relative">
          <input
            value={inputValue}
            placeholder="Tomorrow or next week"
            onChange={handleInputChange}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 pr-9 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <DatePickerTrigger className="absolute inset-y-0 right-0 flex size-auto items-center justify-center border-0 bg-transparent px-2 text-muted-foreground shadow-none hover:bg-transparent hover:text-foreground" />
        </div>
        <DatePickerContent>
          <DatePickerDayView />
          <DatePickerMonthView />
          <DatePickerYearView />
        </DatePickerContent>
      </DatePicker>
      <div className="px-1 text-sm text-muted-foreground">
        Your post will be published on{" "}
        <span className="font-medium">{formatDate(resolvedDate)}</span>.
      </div>
    </div>
  )
}
