"use client"

import * as React from "react"
import {
  Calendar,
  CalendarDate,
  type DateValue,
  type DatePickerValueChangeDetails,
} from "@/examples/ark/ui/calendar"
import { Card, CardContent } from "@/examples/ark/ui/card"

export function CalendarRange() {
  const [value, setValue] = React.useState<DateValue[]>([
    new CalendarDate(2026, 1, 12),
    new CalendarDate(2026, 2, 11),
  ])

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          selectionMode="range"
          defaultFocusedValue={new CalendarDate(2026, 1, 12)}
          value={value}
          onValueChange={(details: DatePickerValueChangeDetails) =>
            setValue(details.value)
          }
          numOfMonths={2}
          max={new CalendarDate(2026, 3, 21)}
          min={new CalendarDate(1900, 1, 1)}
        />
      </CardContent>
    </Card>
  )
}
