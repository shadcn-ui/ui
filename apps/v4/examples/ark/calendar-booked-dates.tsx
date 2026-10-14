"use client"

import * as React from "react"

import {
  Calendar,
  getLocalTimeZone,
  today,
  type DatePickerValueChangeDetails,
  type DateValue,
} from "@/styles/ark-nova/ui/calendar"
import { Card, CardContent } from "@/styles/ark-nova/ui/card"

export function CalendarBookedDates() {
  const now = today(getLocalTimeZone())
  const [value, setValue] = React.useState<DateValue[]>([now])

  const bookedStart = now.add({ days: 9 })
  const bookedEnd = now.add({ days: 23 })

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          selectionMode="single"
          defaultFocusedValue={now}
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
