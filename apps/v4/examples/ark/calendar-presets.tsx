"use client"

import * as React from "react"
import { Button } from "@/examples/ark/ui/button"
import {
  Calendar,
  CalendarDate,
  type DateValue,
  type DatePickerValueChangeDetails,
} from "@/examples/ark/ui/calendar"
import { Card, CardContent, CardFooter } from "@/examples/ark/ui/card"

function toCalendarDate(date: Date): CalendarDate {
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function CalendarWithPresets() {
  const [value, setValue] = React.useState<DateValue[]>([
    new CalendarDate(2026, 2, 12),
  ])
  const [focusedValue, setFocusedValue] = React.useState<DateValue>(
    new CalendarDate(2026, 2, 12)
  )

  return (
    <Card className="mx-auto w-fit max-w-[300px]" size="sm">
      <CardContent>
        <Calendar
          selectionMode="single"
          value={value}
          onValueChange={(details: DatePickerValueChangeDetails) =>
            setValue(details.value)
          }
          focusedValue={focusedValue}
          onFocusChange={(details) => setFocusedValue(details.focusedValue)}
          fixedWeeks
          className="p-0 [--cell-size:--spacing(9.5)]"
        />
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t">
        {[
          { label: "Today", value: 0 },
          { label: "Tomorrow", value: 1 },
          { label: "In 3 days", value: 3 },
          { label: "In a week", value: 7 },
          { label: "In 2 weeks", value: 14 },
        ].map((preset) => (
          <Button
            key={preset.value}
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              const newDate = addDays(new Date(), preset.value)
              const calDate = toCalendarDate(newDate)
              setValue([calDate])
              setFocusedValue(calDate)
            }}
          >
            {preset.label}
          </Button>
        ))}
      </CardFooter>
    </Card>
  )
}
