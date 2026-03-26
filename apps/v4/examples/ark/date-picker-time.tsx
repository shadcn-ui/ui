"use client"

import { useState } from "react"
import { CalendarDateTime } from "@internationalized/date"
import {
  DatePicker,
  DatePickerControl,
  DatePickerInput,
  DatePickerTrigger,
  DatePickerContent,
  DatePickerDayView,
  DatePickerMonthView,
  DatePickerYearView,
  type DatePickerValueChangeDetails,
} from "@/examples/ark/ui/date-picker"

export function DatePickerTime() {
  const [value, setValue] = useState<CalendarDateTime[]>([])

  const timeValue = value[0]
    ? `${String(value[0].hour).padStart(2, "0")}:${String(value[0].minute).padStart(2, "0")}`
    : ""

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
    <div className="mx-auto flex max-w-xs flex-row items-end gap-3">
      <DatePicker
        value={value}
        onValueChange={onDateChange}
        closeOnSelect={false}
      >
        <div className="flex flex-col gap-1.5">
          <DatePickerControl>
            <DatePickerInput />
            <DatePickerTrigger />
          </DatePickerControl>
        </div>
        <DatePickerContent>
          <DatePickerDayView />
          <DatePickerMonthView />
          <DatePickerYearView />
        </DatePickerContent>
      </DatePicker>
      <div className="flex w-32 flex-col gap-1.5">
        <label
          htmlFor="time-picker-optional"
          className="text-sm font-medium leading-none"
        >
          Time
        </label>
        <input
          type="time"
          id="time-picker-optional"
          step="1"
          value={timeValue}
          onChange={onTimeChange}
          className="flex h-9 w-full appearance-none rounded-md border border-input bg-background px-3 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  )
}
