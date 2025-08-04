"use client"

import * as React from "react"

import { Calendar } from "@/registry/new-york-v4/ui/calendar"

export default function Calendar15() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )

  return (
    <Calendar
      mode="single"
      defaultMonth={date}
      selected={date}
      onSelect={setDate}
      className="rounded-lg border shadow-sm"
      showWeekNumber
    />
  )
}
