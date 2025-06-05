"use client"

import * as React from "react"
import { type DateRange } from "react-day-picker"

import { Calendar } from "@/registry/new-york-v4/ui/calendar"

export default function Calendar11() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 17),
    to: new Date(2025, 5, 20),
  })

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Calendar
        mode="range"
        selected={dateRange}
        onSelect={setDateRange}
        numberOfMonths={2}
        startMonth={new Date(2025, 5, 1)}
        endMonth={new Date(2025, 6, 31)}
        disableNavigation
        className="rounded-lg border shadow-sm"
      />
      <div className="text-muted-foreground text-center text-xs">
        We are open in June and July only.
      </div>
    </div>
  )
}
