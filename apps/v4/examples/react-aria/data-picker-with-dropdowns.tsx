"use client"

import * as React from "react"
import { Button } from "@/examples/react-aria/ui/button"
import { Calendar } from "@/examples/react-aria/ui/calendar"
import { Field, FieldLabel } from "@/examples/react-aria/ui/field"
import { Popover, PopoverTrigger } from "@/examples/react-aria/ui/popover";
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

export function DataPickerWithDropdowns() {
  const [date, setDate] = React.useState<Date>()
  const [open, setOpen] = React.useState(false)

  return (
    <Field className="mx-auto w-72">
      <PopoverTrigger isOpen={open} onOpenChange={setOpen}>
        <FieldLabel htmlFor="date-picker-with-dropdowns-desktop">
          Date
        </FieldLabel>
        <Button
          variant="outline"
          id="date-picker-with-dropdowns-desktop"
          className="justify-start px-2.5 font-normal">
          <ChevronDownIcon className="ml-auto" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
        <Popover className="w-auto p-0" align="start">
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
        </Popover>
      </PopoverTrigger>
    </Field>
  );
}
