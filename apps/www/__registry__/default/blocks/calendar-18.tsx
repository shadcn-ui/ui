"use client"

import * as React from "react"

import { Calendar } from "@/registry/default/ui/calendar"

export default function Calendar18() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border [--cell-size:2.75rem] md:[--cell-size:3rem]"
      buttonVariant="ghost"
    />
  )
}
