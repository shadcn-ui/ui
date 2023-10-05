"use client"

import * as React from "react"

import { Calendar } from "@/registry/new-york/ui/calendar"

export default function CalendarDropdownButton() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Calendar
      initialFocus
      mode="single"
      captionLayout="dropdown-buttons"
      fromYear={2022}
      toYear={2023}
      // numberOfMonths={2}
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  )
}
