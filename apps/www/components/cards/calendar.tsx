"use client"

import { addDays } from "date-fns"

import { Calendar } from "@/registry/new-york/ui/calendar"
import { Card, CardContent } from "@/registry/new-york/ui/card"

const now = new Date()
const start = new Date(now.getFullYear(), now.getMonth(), 5)

export function CardsCalendar() {
  return (
    <Card className="max-w-[260px]">
      <CardContent className="p-1">
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
