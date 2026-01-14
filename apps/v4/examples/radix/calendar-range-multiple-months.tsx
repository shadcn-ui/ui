"use client"

import * as React from "react"
import { Calendar } from "@/examples/radix/ui/calendar"
import { Card, CardContent } from "@/examples/radix/ui/card"
import { addDays } from "date-fns"
import { type DateRange } from "react-day-picker"
import { es } from "react-day-picker/locale"

export function CalendarRangeMultipleMonths() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 3, 12),
    to: addDays(new Date(new Date().getFullYear(), 3, 12), 60),
  })

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          mode="range"
          defaultMonth={range?.from}
          selected={range}
          onSelect={setRange}
          numberOfMonths={3}
          locale={es}
          fixedWeeks
        />
      </CardContent>
    </Card>
  )
}
