"use client"

import * as React from "react"
import { DateRange } from "react-day-picker"

import { Calendar } from "@/registry/new-york-v4/ui/calendar"

export default function Calendar15() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 5, 23),
  })

  return (
    <Calendar
      mode="range"
      defaultMonth={dateRange?.from}
      selected={dateRange}
      onSelect={setDateRange}
      className="rounded-lg border shadow-sm"
      showWeekNumber
    />
  )
}
