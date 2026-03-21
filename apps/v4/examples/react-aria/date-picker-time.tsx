"use client"

import * as React from "react"
import { Button } from "@/examples/react-aria/ui/button"
import { Calendar } from "@/examples/react-aria/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/examples/react-aria/ui/field"
import { Input } from "@/examples/react-aria/ui/input"
import { Popover, PopoverTrigger } from "@/examples/react-aria/ui/popover";
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

export function DatePickerTime() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  return (
    <FieldGroup className="mx-auto max-w-xs flex-row">
      <Field>
        <FieldLabel htmlFor="date-picker-optional">Date</FieldLabel>
        <PopoverTrigger isOpen={open} onOpenChange={setOpen}>
          <Button
            variant="outline"
            id="date-picker-optional"
            className="w-32 justify-between font-normal">
            {date ? format(date, "PPP") : "Select date"}
            <ChevronDownIcon data-icon="inline-end" />
          </Button>
          <Popover className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              defaultMonth={date}
              onSelect={(date) => {
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
  );
}
