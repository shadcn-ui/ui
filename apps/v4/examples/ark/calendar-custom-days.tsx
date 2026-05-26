"use client"

import {
  Calendar,
  CalendarDate,
  CalendarDayView,
} from "@/examples/ark/ui/calendar"
import { Card, CardContent } from "@/examples/ark/ui/card"
import { isWeekend } from "@internationalized/date"

export function CalendarCustomDays() {
  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          selectionMode="range"
          defaultFocusedValue={
            new CalendarDate(new Date().getFullYear(), 12, 8)
          }
          className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
        >
          <CalendarDayView
            cell={(day) => (
              <div className="flex flex-col items-center gap-1">
                {day.day}
                <span className="text-[0.6rem] text-muted-foreground">
                  {isWeekend(day, "en-US") ? "$120" : "$100"}
                </span>
              </div>
            )}
          />
        </Calendar>
      </CardContent>
    </Card>
  )
}
