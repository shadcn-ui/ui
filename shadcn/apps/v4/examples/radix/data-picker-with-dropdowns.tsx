"use client"

import * as React from "react"
import { Button } from "@/examples/radix/ui/button"
import { Calendar } from "@/examples/radix/ui/calendar"
import { Field, FieldLabel } from "@/examples/radix/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/examples/radix/ui/popover"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

export function DataPickerWithDropdowns() {
  const [date, setDate] = React.useState<Date>()
  const [open, setOpen] = React.useState(false)

  return (
    <Field className="mx-auto w-72">
      <Popover open={open} onOpenChange={setOpen}>
        <FieldLabel htmlFor="date-picker-with-dropdowns-desktop">
          Date
        </FieldLabel>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-with-dropdowns-desktop"
            className="justify-start px-2.5 font-normal"
          >
            {date ? format(date, "PPP") : <span>Pick a date</span>}
            <ChevronDownIcon className="ml-auto" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            captionLayout="dropdown"
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
