"use client"

import * as React from "react"
import { type CalendarDate, getLocalTimeZone } from "@internationalized/date"

import { Button } from "@/styles/react-aria-nova/ui/button"
import { Calendar } from "@/styles/react-aria-nova/ui/calendar"
import { Field, FieldLabel } from "@/styles/react-aria-nova/ui/field"
import { Popover, PopoverTrigger } from "@/styles/react-aria-nova/ui/popover"

export function DatePickerSimple() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<CalendarDate | null>(null)

  return (
    <Field className="mx-auto w-44">
      <FieldLabel htmlFor="date">Date of birth</FieldLabel>
      <PopoverTrigger isOpen={open} onOpenChange={setOpen}>
        <Button
          variant="outline"
          id="date"
          className="justify-start font-normal"
        >
          {date ? date.toDate(getLocalTimeZone()).toLocaleDateString() : "Select date"}
        </Button>
        <Popover className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            value={date}
            captionLayout="dropdown"
            onChange={(date) => {
              setDate(date)
              setOpen(false)
            }}
          />
        </Popover>
      </PopoverTrigger>
    </Field>
  )
}
