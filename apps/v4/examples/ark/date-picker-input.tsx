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
import { Field, FieldLabel } from "@/examples/ark/ui/field"

export function DatePickerInput() {
  return (
    <Field className="mx-auto w-48">
      <FieldLabel>Subscription Date</FieldLabel>
      <DatePicker closeOnSelect>
        <DatePickerControl>
          <DatePickerInputComponent placeholder="mm/dd/yyyy" />
          <DatePickerTrigger />
        </DatePickerControl>
        <DatePickerContent>
          <DatePickerDayView />
          <DatePickerMonthView />
          <DatePickerYearView />
        </DatePickerContent>
      </DatePicker>
    </Field>
  )
}
