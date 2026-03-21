"use client"

import * as React from "react"
import {
  Calendar,
  CalendarDate,
  type DateValue,
  type DatePickerValueChangeDetails,
} from "@/examples/ark/ui/calendar"
import { Card, CardContent } from "@/examples/ark/ui/card"

export function CalendarWeekNumbers() {
  const [value, setValue] = React.useState<DateValue[]>([
    new CalendarDate(2026, 2, 3),
  ])

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          selectionMode="single"
          defaultFocusedValue={new CalendarDate(2026, 2, 3)}
          value={value}
          onValueChange={(details: DatePickerValueChangeDetails) =>
            setValue(details.value)
          }
        />
      </CardContent>
    </Card>
  )
}
