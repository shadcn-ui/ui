"use client"

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
} from "@/examples/ark/ui/date-picker"
import { ChevronDownIcon } from "lucide-react"

export function DatePickerSimple() {
  return (
    <DatePicker closeOnSelect>
      <DatePickerControl>
        <DatePickerTrigger asChild>
          <Button
            variant="outline"
            className="w-[212px] justify-between text-left font-normal"
          >
            <DatePickerValueText placeholder="Pick a date" />
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
  )
}
