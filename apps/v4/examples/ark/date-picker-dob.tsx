"use client"

import { Button } from "@/examples/ark/ui/button"
import {
  DatePicker,
  DatePickerContent,
  DatePickerControl,
  DatePickerDayView,
  DatePickerTrigger,
  DatePickerValueText,
} from "@/examples/ark/ui/date-picker"
import { Field, FieldLabel } from "@/examples/ark/ui/field"

export function DatePickerSimple() {
  return (
    <Field className="mx-auto w-44">
      <FieldLabel>Date of birth</FieldLabel>
      <DatePicker closeOnSelect>
        <DatePickerControl>
          <DatePickerTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start font-normal"
            >
              <DatePickerValueText placeholder="Select date" />
            </Button>
          </DatePickerTrigger>
        </DatePickerControl>
        <DatePickerContent>
          <DatePickerDayView />
        </DatePickerContent>
      </DatePicker>
    </Field>
  )
}
