"use client"

import * as React from "react"

import { Calendar } from "@/registry/new-york-v4/ui/calendar"

export default function Calendar02() {
  const [range, setRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  } | undefined>({
    from: new Date(2025, 5, 12),
    to: undefined,
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
