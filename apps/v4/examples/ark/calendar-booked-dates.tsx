"use client"

import * as React from "react"
import {
  Calendar,
  CalendarDate,
  type DatePickerValueChangeDetails,
  type DateValue,
} from "@/examples/ark/ui/calendar"
import { Card, CardContent } from "@/examples/ark/ui/card"

export function CalendarBookedDates() {
  const [value, setValue] = React.useState<DateValue[]>([
    new CalendarDate(2026, 2, 3),
  ])

  const bookedStart = new CalendarDate(2026, 2, 12)
  const bookedEnd = new CalendarDate(2026, 2, 26)

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
          isDateUnavailable={(date) =>
            date.compare(bookedStart) >= 0 && date.compare(bookedEnd) <= 0
          }
        />
      </CardContent>
    </Card>
  )
}
