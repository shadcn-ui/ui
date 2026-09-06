"use client"

import * as React from "react"
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date"

import { Button } from "@/styles/aria-nova/ui/button"
import { Calendar } from "@/styles/aria-nova/ui/calendar"
import { Card, CardContent, CardFooter } from "@/styles/aria-nova/ui/card"

export function CalendarWithPresets() {
  const [date, setDate] = React.useState<CalendarDate | undefined>(
    new CalendarDate(new Date().getFullYear(), 2, 12)
  )
  const [currentMonth, setCurrentMonth] = React.useState<CalendarDate>(
    new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, 1)
  )

  return (
    <Card className="mx-auto w-fit max-w-[300px]" size="sm">
      <CardContent>
        <Calendar
          value={date}
          onChange={setDate}
          focusedValue={currentMonth}
          onFocusChange={setCurrentMonth}
          weeksInMonth={6}
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
            onPress={() => {
              const newDate = today(getLocalTimeZone()).add({
                days: preset.value,
              })
              setDate(newDate)
              setCurrentMonth(newDate)
            }}
          >
            {preset.label}
          </Button>
        ))}
      </CardFooter>
    </Card>
  )
}
