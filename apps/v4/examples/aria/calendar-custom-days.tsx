"use client"

import * as React from "react"
import { CalendarDate, isWeekend } from "@internationalized/date"
import { useLocale, type DateRange } from "react-aria-components"

import { RangeCalendar } from "@/styles/aria-nova/ui/calendar"
import { Card, CardContent } from "@/styles/aria-nova/ui/card"

export function CalendarCustomDays() {
  const { locale } = useLocale()
  const [range, setRange] = React.useState<DateRange | undefined>({
    start: new CalendarDate(new Date().getFullYear(), 12, 8),
    end: new CalendarDate(new Date().getFullYear(), 12, 8).add({ days: 10 }),
  })

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <RangeCalendar
          value={range}
          onChange={setRange}
          numberOfMonths={1}
          captionLayout="dropdown"
          className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
          headerFormat={{ month: "long" }}
          renderCell={({ isOutsideMonth, date, defaultChildren }) => (
            <>
              {defaultChildren}
              {!isOutsideMonth && (
                <span>{isWeekend(date, locale) ? "$120" : "$100"}</span>
              )}
            </>
          )}
        />
      </CardContent>
    </Card>
  )
}
