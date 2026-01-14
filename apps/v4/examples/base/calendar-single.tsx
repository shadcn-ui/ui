"use client"

import * as React from "react"
import { Calendar } from "@/examples/base/ui/calendar"
import { Card, CardContent } from "@/examples/base/ui/card"

export function CalendarSingle() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 12)
  )
  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          captionLayout="dropdown"
        />
      </CardContent>
    </Card>
  )
}
