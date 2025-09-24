"use client"

import * as React from "react"

import { Calendar } from "@/registry/new-york-v4/ui/calendar"

export default function Calendar14() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )
  const bookedDates = Array.from(
    { length: 12 },
    (_, i) => new Date(2025, 5, 15 + i)
  )

  return (
    <Calendar
      mode="single"
      defaultMonth={date}
      selected={date}
      onSelect={setDate}
      disabled={bookedDates}
      modifiers={{
        booked: bookedDates,
      }}
      modifiersClassNames={{
        booked: "[&>button]:line-through opacity-100",
      }}
      className="rounded-lg border shadow-sm"
    />
  )
}
