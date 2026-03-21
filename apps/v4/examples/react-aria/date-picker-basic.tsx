"use client"

import * as React from "react"
import { Button } from "@/examples/react-aria/ui/button"
import { Calendar } from "@/examples/react-aria/ui/calendar"
import { Field, FieldLabel } from "@/examples/react-aria/ui/field"
import { Popover, PopoverTrigger } from "@/examples/react-aria/ui/popover"
import { format } from "date-fns"

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
