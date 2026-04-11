"use client"

import * as React from "react"

import { Calendar } from "@/styles/react-aria-nova/ui/calendar"
import { type CalendarDate, getLocalTimeZone, today } from "@internationalized/date"

export default function CalendarDemo() {
  const [date, setDate] = React.useState<CalendarDate | undefined>(today(getLocalTimeZone()))

  return (
    <Calendar
      value={date}
      onChange={setDate}
      className="rounded-lg border"
      captionLayout="dropdown"
    />
  )
}
