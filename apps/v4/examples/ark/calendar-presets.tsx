"use client"

import { Button } from "@/examples/ark/ui/button"
import {
  Calendar,
  CalendarDayView,
  CalendarPresetTrigger,
} from "@/examples/ark/ui/calendar"
import { Card, CardContent, CardFooter } from "@/examples/ark/ui/card"
import { CalendarDate } from "@internationalized/date"

function daysFromNow(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return [new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())]
}

export function CalendarWithPresets() {
  return (
    <Calendar fixedWeeks>
      <Card className="mx-auto w-fit max-w-[300px]" size="sm">
        <CardContent>
          <CalendarDayView />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t">
          {[
            { label: "Today", value: daysFromNow(0) },
            { label: "Tomorrow", value: daysFromNow(1) },
            { label: "In 3 days", value: daysFromNow(3) },
            { label: "In a week", value: daysFromNow(7) },
            { label: "In 2 weeks", value: daysFromNow(14) },
          ].map((preset) => (
            <CalendarPresetTrigger
              key={preset.label}
              value={preset.value}
              asChild
            >
              <Button variant="outline" size="sm" className="flex-1">
                {preset.label}
              </Button>
            </CalendarPresetTrigger>
          ))}
        </CardFooter>
      </Card>
    </Calendar>
  )
}
