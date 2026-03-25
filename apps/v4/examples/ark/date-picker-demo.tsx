"use client"

import {
  DatePicker,
  DatePickerContent,
  DatePickerControl,
  DatePickerDayView,
  DatePickerInput,
  DatePickerMonthView,
  DatePickerTrigger,
  DatePickerYearView,
} from "@/examples/ark/ui/date-picker"

export function DatePickerDemo() {
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
