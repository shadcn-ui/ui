"use client"

import * as React from "react"
import { Calendar } from "@/examples/base/ui/calendar"
import { enUS } from "react-day-picker/locale"

export default function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      locale={enUS}
      className="rounded-lg border"
      captionLayout="dropdown"
    />
  )
}
