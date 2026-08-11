"use client"

import * as React from "react"
import {
  getLocalTimeZone,
  today,
  type CalendarDate,
} from "@internationalized/date"
import { I18nProvider } from "react-aria-components"

import { Calendar } from "@/styles/aria-nova/ui-rtl/calendar"

export function CalendarRtl() {
  const [date, setDate] = React.useState<CalendarDate | undefined>(
    today(getLocalTimeZone())
  )

  return (
    <I18nProvider locale="ar">
      <Calendar
        value={date}
        onChange={setDate}
        className="rounded-lg border [--cell-size:--spacing(9)]"
        captionLayout="dropdown"
      />
    </I18nProvider>
  )
}
