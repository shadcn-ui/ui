"use client"

import { Button } from "@/styles/ark-nova/ui/button"
import {
  Calendar,
  CalendarDayView,
  CalendarPresetTrigger,
  getLocalTimeZone,
  today,
} from "@/styles/ark-nova/ui/calendar"
import { Card, CardContent, CardFooter } from "@/styles/ark-nova/ui/card"

function daysFromNow(days: number) {
  return [today(getLocalTimeZone()).add({ days })]
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
