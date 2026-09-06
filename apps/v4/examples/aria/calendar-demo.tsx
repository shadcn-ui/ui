"use client"

import * as React from "react"
import {
  getLocalTimeZone,
  today,
  type CalendarDate,
} from "@internationalized/date"

import { Calendar } from "@/styles/aria-nova/ui/calendar"

export default function CalendarDemo() {
  const [date, setDate] = React.useState<CalendarDate | undefined>(
    today(getLocalTimeZone())
  )

  return (
    <Calendar
      value={date}
      onChange={setDate}
      className="rounded-lg border"
      captionLayout="dropdown"
    />
  )
}
