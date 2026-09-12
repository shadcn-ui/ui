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

export function CalendarWeekNumbers() {
  const [value, setValue] = React.useState<DateValue[]>([
    today(getLocalTimeZone()),
  ])

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          selectionMode="single"
          defaultFocusedValue={today(getLocalTimeZone())}
          value={value}
          onValueChange={(details: DatePickerValueChangeDetails) =>
            setValue(details.value)
          }
        />
      </CardContent>
    </Card>
  )
}
