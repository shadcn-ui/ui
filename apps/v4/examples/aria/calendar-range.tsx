"use client"

import * as React from "react"
import { CalendarDate } from "@internationalized/date"
import { type DateRange } from "react-aria-components"

import { RangeCalendar } from "@/styles/aria-nova/ui/calendar"

export function CalendarRange() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    start: new CalendarDate(new Date().getFullYear(), 1, 12),
    end: new CalendarDate(new Date().getFullYear(), 1, 12).add({ days: 30 }),
  })

  return (
    <RangeCalendar
      value={dateRange}
      onChange={setDateRange}
      numberOfMonths={2}
      className="rounded-lg border"
    />
  )
}
