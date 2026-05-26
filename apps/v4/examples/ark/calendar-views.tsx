"use client"

import {
  Calendar,
  CalendarDayView,
  CalendarMonthView,
  CalendarViewHeader,
  CalendarYearView,
} from "@/examples/ark/ui/calendar"

export default function CalendarViews() {
  return (
    <Calendar selectionMode="single" className="rounded-lg border">
      <CalendarDayView header={<CalendarViewHeader />} />
      <CalendarMonthView header={<CalendarViewHeader />} />
      <CalendarYearView header={<CalendarViewHeader />} />
    </Calendar>
  )
}
