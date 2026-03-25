"use client"

import {
  DatePicker,
  DatePickerControl,
  DatePickerInput,
  DatePickerTrigger,
  DatePickerContent,
  DatePickerDayView,
  DatePickerMonthView,
  DatePickerYearView,
} from "@/examples/ark/ui/date-picker"

export function DatePickerWithRange() {
  return (
    <DatePicker selectionMode="range">
      <DatePickerControl>
        <DatePickerInput index={0} />
        <DatePickerInput index={1} />
        <DatePickerTrigger />
      </DatePickerControl>
      <DatePickerContent>
        <DatePickerDayView />
        <DatePickerMonthView />
        <DatePickerYearView />
      </DatePickerContent>
    </DatePicker>
  )
}
