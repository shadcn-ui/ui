"use client"

import * as React from "react"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/styles/react-aria-nova/ui/button"
import { Calendar } from "@/styles/react-aria-nova/ui/calendar"
import { Popover, PopoverTrigger } from "@/styles/react-aria-nova/ui/popover"

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>()

  return (
    <PopoverTrigger>
      <Button
        variant={"outline"}
        data-empty={!date}
        className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
      >
        {date ? format(date, "PPP") : <span>Pick a date</span>}
        <ChevronDownIcon data-icon="inline-end" />
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
  )
}
