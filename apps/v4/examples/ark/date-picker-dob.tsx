"use client"

import { Button } from "@/styles/ark-nova/ui/button"
import {
  DatePicker,
  DatePickerContent,
  DatePickerControl,
  DatePickerDayView,
  DatePickerTrigger,
  DatePickerValueText,
} from "@/styles/ark-nova/ui/date-picker"
import { Field, FieldLabel } from "@/styles/ark-nova/ui/field"

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
