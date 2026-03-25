"use client"

import {
  DatePicker,
  DatePickerControl,
  DatePickerInput as DatePickerInputComponent,
  DatePickerTrigger,
  DatePickerContent,
  DatePickerDayView,
  DatePickerMonthView,
  DatePickerYearView,
} from "@/examples/ark/ui/date-picker"

export function DatePickerInput() {
  return (
    <DatePicker>
      <DatePickerControl>
        <DatePickerInputComponent />
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
