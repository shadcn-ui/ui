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

export function CalendarRange() {
  const now = today(getLocalTimeZone())
  const [value, setValue] = React.useState<DateValue[]>([
    now,
    now.add({ days: 30 }),
  ])

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          selectionMode="range"
          defaultFocusedValue={now}
          value={value}
          onValueChange={(details: DatePickerValueChangeDetails) =>
            setValue(details.value)
          }
          numOfMonths={2}
          max={now.add({ years: 1 })}
          min={now.subtract({ years: 100 })}
        />
      </CardContent>
    </Card>
  )
}
