"use client"

import * as React from "react"
import { Button } from "@/examples/ark/ui/button"
import {
  Calendar,
  CalendarDate,
  type DatePickerValueChangeDetails,
  type DateValue,
} from "@/examples/ark/ui/calendar"
import { Field, FieldLabel } from "@/examples/ark/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/examples/ark/ui/popover"
import { DateFormatter } from "@internationalized/date"
import { ChevronDownIcon } from "lucide-react"

const formatter = new DateFormatter("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
})

function formatDate(dv: DateValue): string {
  return formatter.format(dv.toDate("UTC"))
}

export function DataPickerWithDropdowns() {
  const [date, setDate] = React.useState<DateValue[]>([
    new CalendarDate(2026, 3, 21),
  ])
  const [open, setOpen] = React.useState(false)

  return (
    <Field className="mx-auto w-72">
      <Popover open={open} onOpenChange={(details) => setOpen(details.open)}>
        <FieldLabel htmlFor="date-picker-with-dropdowns-desktop">
          Date
        </FieldLabel>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-with-dropdowns-desktop"
            className="justify-start px-2.5 font-normal"
          >
            {date.length ? formatDate(date[0]) : <span>Pick a date</span>}
            <ChevronDownIcon className="ml-auto" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            selectionMode="single"
            value={date}
            onValueChange={(details: DatePickerValueChangeDetails) =>
              setDate(details.value)
            }
          />
          <div className="flex gap-2 border-t p-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  )
}
