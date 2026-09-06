"use client"

import * as React from "react"
import { getLocalTimeZone, type CalendarDate } from "@internationalized/date"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/styles/aria-nova/ui/button"
import { Calendar } from "@/styles/aria-nova/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/styles/aria-nova/ui/field"
import { Input } from "@/styles/aria-nova/ui/input"
import { Popover, PopoverTrigger } from "@/styles/aria-nova/ui/popover"

export function DatePickerTime() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<CalendarDate | undefined>(undefined)

  return (
    <FieldGroup className="mx-auto max-w-xs flex-row">
      <Field>
        <FieldLabel htmlFor="date-picker-optional">Date</FieldLabel>
        <PopoverTrigger isOpen={open} onOpenChange={setOpen}>
          <Button
            variant="outline"
            id="date-picker-optional"
            className="w-32 justify-between font-normal"
          >
            {date
              ? date.toDate(getLocalTimeZone()).toLocaleDateString()
              : "Select date"}
            <ChevronDownIcon data-icon="inline-end" />
          </Button>
          <Popover
            className="w-auto overflow-hidden p-0"
            placement="bottom start"
          >
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
      <Field className="w-32">
        <FieldLabel htmlFor="time-picker-optional">Time</FieldLabel>
        <Input
          type="time"
          id="time-picker-optional"
          step="1"
          defaultValue="10:30:00"
          className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  )
}
