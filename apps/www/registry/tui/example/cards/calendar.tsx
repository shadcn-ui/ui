"use client"

import { addDays } from "date-fns"

import { Calendar } from "@/registry/tui/ui/calendar"
import { Card, CardContent } from "@/registry/tui/ui/card"

const start = new Date(2023, 5, 5)

export function CardsCalendar() {
  return (
    <Card className="max-w-[280px]">
      <CardContent className="p-0">
        <Calendar
          numberOfMonths={1}
          mode="range"
          defaultMonth={start}
          selected={{
            from: start,
            to: addDays(start, 8),
          }}
        />
      </CardContent>
    </Card>
  )
}
