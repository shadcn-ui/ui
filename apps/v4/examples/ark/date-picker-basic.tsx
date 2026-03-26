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

export function DatePickerSimple() {
  return (
    <DatePicker>
      <DatePickerControl>
        <DatePickerInput />
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
