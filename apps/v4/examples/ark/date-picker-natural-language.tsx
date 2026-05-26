"use client"

import { useState } from "react"
import { parseDate } from "chrono-node"
import { DateFormatter } from "@internationalized/date"
import {
  DatePicker,
  DatePickerControl,
  DatePickerInput,
  DatePickerTrigger,
  DatePickerContent,
  DatePickerDayView,
  DatePickerMonthView,
  DatePickerYearView,
  CalendarDate,
  type DateValue,
} from "@/examples/ark/ui/date-picker"

function toCalendarDate(date: Date): CalendarDate {
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
}

const formatter = new DateFormatter("en-US", {
  day: "2-digit",
  month: "long",
  year: "numeric",
})

export function DatePickerNaturalLanguage() {
  const initialDate = parseDate("In 2 days")
  const [pickerValue, setPickerValue] = useState<CalendarDate[]>(
    initialDate ? [toCalendarDate(initialDate)] : []
  )

  return (
    <div className="mx-auto flex max-w-xs flex-col gap-1.5">
      <DatePicker
        value={pickerValue}
        onValueChange={(details) => setPickerValue(details.value as CalendarDate[])}
        parse={(value) => {
          const parsed = parseDate(value)
          if (parsed) return toCalendarDate(parsed)
          return undefined
        }}
      >
        <DatePickerControl>
          <DatePickerInput placeholder="Tomorrow or next week" />
          <DatePickerTrigger />
        </DatePickerControl>
        <DatePickerContent>
          <DatePickerDayView />
          <DatePickerMonthView />
          <DatePickerYearView />
        </DatePickerContent>
      </DatePicker>
      <div className="px-1 text-sm text-muted-foreground">
        {pickerValue.length > 0 && (
          <>
            Your post will be published on{" "}
            <span className="font-medium">
              {formatter.format(pickerValue[0].toDate("UTC"))}
            </span>
            .
          </>
        )}
      </div>
    </div>
  )
}
