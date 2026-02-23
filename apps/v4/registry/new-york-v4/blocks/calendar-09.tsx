"use client"

import * as React from "react"
import { type DateRange } from "react-day-picker"

import { Calendar } from "@/registry/new-york-v4/ui/calendar"

export default function Calendar09() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 17),
    to: new Date(2025, 5, 20),
  })

  return (
    <Calendar
      mode="range"
      defaultMonth={dateRange?.from}
      selected={dateRange}
      onSelect={setDateRange}
      numberOfMonths={2}
      disabled={{ dayOfWeek: [0, 6] }}
      className="rounded-lg border shadow-sm"
      excludeDisabled
    />
  )
}
