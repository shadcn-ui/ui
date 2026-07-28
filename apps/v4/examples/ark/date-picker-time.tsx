"use client"

import { useState } from "react"
import { CalendarDateTime } from "@internationalized/date"
import { Button } from "@/examples/ark/ui/button"
import {
  DatePicker,
  DatePickerContent,
  DatePickerControl,
  DatePickerDayView,
  DatePickerMonthView,
  DatePickerTrigger,
  DatePickerValueText,
  DatePickerYearView,
  type DatePickerValueChangeDetails,
} from "@/examples/ark/ui/date-picker"
import { Field, FieldGroup, FieldLabel } from "@/examples/ark/ui/field"
import { Input } from "@/examples/ark/ui/input"
import { ChevronDownIcon } from "lucide-react"

export function DatePickerTime() {
  const [value, setValue] = useState<CalendarDateTime[]>([])

  const timeValue = value[0]
    ? `${String(value[0].hour).padStart(2, "0")}:${String(value[0].minute).padStart(2, "0")}`
    : "10:30"

  const onTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.currentTarget.value.split(":").map(Number)
    setValue((prev) => {
      const current = prev[0] ?? new CalendarDateTime(2025, 1, 1, 0, 0)
      return [current.set({ hour: hours, minute: minutes })]
    })
  }

  const onDateChange = (details: DatePickerValueChangeDetails) => {
    const newDate = details.value[0]
    if (!newDate) return setValue([])
    const prevTime = value[0] ?? { hour: 0, minute: 0 }
    setValue([
      new CalendarDateTime(
        newDate.year,
        newDate.month,
        newDate.day,
        prevTime.hour,
        prevTime.minute
      ),
    ])
  }

  return (
    <FieldGroup className="mx-auto max-w-xs flex-row">
      <Field className="flex-1">
        <FieldLabel htmlFor="date-picker-time">Date</FieldLabel>
        <DatePicker
          value={value}
          onValueChange={onDateChange}
          closeOnSelect={false}
        >
          <DatePickerControl>
            <DatePickerTrigger asChild>
              <Button
                variant="outline"
                id="date-picker-time"
                className="w-full justify-between font-normal"
              >
                <DatePickerValueText placeholder="Select date" />
                <ChevronDownIcon className="size-4 text-muted-foreground" />
              </Button>
            </DatePickerTrigger>
          </DatePickerControl>
          <DatePickerContent>
            <DatePickerDayView />
            <DatePickerMonthView />
            <DatePickerYearView />
          </DatePickerContent>
        </DatePicker>
      </Field>
      <Field className="w-32">
        <FieldLabel htmlFor="time-picker-optional">Time</FieldLabel>
        <Input
          type="time"
          id="time-picker-optional"
          step="1"
          value={timeValue}
          onChange={onTimeChange}
          className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  )
}
