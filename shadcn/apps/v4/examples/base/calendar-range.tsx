"use client"

import * as React from "react"
import { Calendar } from "@/examples/base/ui/calendar"
import { Card, CardContent } from "@/examples/base/ui/card"
import { addDays } from "date-fns"
import { type DateRange } from "react-day-picker"

export function CalendarRange() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 12),
    to: addDays(new Date(new Date().getFullYear(), 0, 12), 30),
  })

  return (
    <Calendar
      mode="range"
      defaultMonth={dateRange?.from}
      selected={dateRange}
      onSelect={setDateRange}
      numberOfMonths={2}
      className="rounded-lg border"
    />
  )
}
