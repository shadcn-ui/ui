"use client"

import * as React from "react"

import { Calendar } from "@/registry/default/ui/calendar"

export default function CalendarDropdown() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Calendar
      initialFocus
      mode="single"
      captionLayout="dropdown-buttons"
      fromYear={2022}
      toYear={2023}
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  )
}
