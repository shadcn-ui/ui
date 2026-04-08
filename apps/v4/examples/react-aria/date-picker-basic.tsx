"use client"

import * as React from "react"
import { format } from "date-fns"

import { Button } from "@/styles/react-aria-nova/ui/button"
import { Calendar } from "@/styles/react-aria-nova/ui/calendar"
import { Field, FieldLabel } from "@/styles/react-aria-nova/ui/field"
import { Popover, PopoverTrigger } from "@/styles/react-aria-nova/ui/popover"

export function DatePickerSimple() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Field className="mx-auto w-44">
      <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
      <PopoverTrigger>
        <Button
          variant="outline"
          id="date-picker-simple"
          className="justify-start font-normal"
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
        <Popover className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
          />
        </Popover>
      </PopoverTrigger>
    </Field>
  )
}
