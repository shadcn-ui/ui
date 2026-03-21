"use client"

import * as React from "react"
import {
  Calendar,
  CalendarDate,
  type DateValue,
  type DatePickerValueChangeDetails,
} from "@/examples/ark/ui/calendar"

export default function CalendarDemo() {
  const [value, setValue] = React.useState<DateValue[]>([
    new CalendarDate(2026, 3, 21),
  ])

  return (
    <Calendar
      selectionMode="single"
      value={value}
      onValueChange={(details: DatePickerValueChangeDetails) =>
        setValue(details.value)
      }
      className="rounded-lg border"
    />
  )
}
