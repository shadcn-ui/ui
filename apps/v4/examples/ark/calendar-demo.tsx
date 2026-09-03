"use client"

import * as React from "react"

import {
  Calendar,
  getLocalTimeZone,
  today,
  type DatePickerValueChangeDetails,
  type DateValue,
} from "@/styles/ark-nova/ui/calendar"

export default function CalendarDemo() {
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
      className="rounded-lg border"
    />
  )
}
