"use client"

import * as React from "react"
import { Button } from "@/examples/react-aria/ui/button"
import { Calendar } from "@/examples/react-aria/ui/calendar"
import { Popover, PopoverTrigger } from "@/examples/react-aria/ui/popover";
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>()

  return (
    <PopoverTrigger>
      <Button
        variant={"outline"}
        data-empty={!date}
        className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground">
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
  );
}
