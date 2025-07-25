"use client"

import * as React from "react"

import { Calendar } from "@/registry/new-york-v4/ui/calendar"
import type { DateRange } from "react-day-picker"

export default function Calendar02() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 5, 18),
  })

  return (
    <Calendar
      mode="range"
      defaultMonth={range?.from}
      numberOfMonths={2}
      selected={range}
      onSelect={setRange}
      className="rounded-lg border shadow-sm"
    />
  )
}
