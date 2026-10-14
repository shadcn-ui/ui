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
} from "@/styles/ark-nova/ui/date-picker"
import { Field, FieldLabel } from "@/styles/ark-nova/ui/field"

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
