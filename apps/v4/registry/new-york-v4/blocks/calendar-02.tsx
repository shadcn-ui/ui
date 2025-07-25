"use client"

import * as React from "react"
import { DateRange } from "react-day-picker"

import { Calendar } from "@/registry/new-york-v4/ui/calendar"

export default function Calendar02() {
  const [date] = React.useState<Date | undefined>(new Date(2025, 5, 12))
  const [range, setRange] = React.useState<DateRange | undefined>(undefined)

  return (
    <Calendar
      mode="range"
      defaultMonth={date}
      numberOfMonths={2}
      selected={range}
      onSelect={(range) => {
        setRange(range)
      }}
      className="rounded-lg border shadow-sm"
    />
  )
}
