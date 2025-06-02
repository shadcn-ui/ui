"use client"

import * as React from "react"

import { Calendar } from "@/registry/new-york-v4/ui/calendar"

export default function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="flex flex-col flex-wrap items-start gap-2 @md:flex-row">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow-sm"
      />
    </div>
  )
}
