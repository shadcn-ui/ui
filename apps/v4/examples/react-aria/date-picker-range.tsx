"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Button } from "@/styles/react-aria-nova/ui/button"
import { Calendar } from "@/styles/react-aria-nova/ui/calendar"
import { Field, FieldLabel } from "@/styles/react-aria-nova/ui/field"
import { Popover, PopoverTrigger } from "@/styles/react-aria-nova/ui/popover"

export function DatePickerWithRange() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  })

  return (
    <Field className="mx-auto w-60">
      <FieldLabel htmlFor="date-picker-range">Date Picker Range</FieldLabel>
      <PopoverTrigger>
        <Button
          variant="outline"
          id="date-picker-range"
          className="justify-start px-2.5 font-normal"
        >
          <CalendarIcon data-icon="inline-start" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
        <Popover className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </Popover>
      </PopoverTrigger>
    </Field>
  )
}
