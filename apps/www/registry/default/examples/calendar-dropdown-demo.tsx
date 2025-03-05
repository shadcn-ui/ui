"use client"

import * as React from "react"

import { Calendar } from "@/registry/default/ui/calendar"

export default function CalendarDropdownDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
      captionLayout="dropdown"
      fromYear={1900}
      toYear={2100}
    />
  )
}
