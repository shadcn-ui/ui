"use client"

import * as React from "react"
import { getLocalTimeZone, type CalendarDate } from "@internationalized/date"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/styles/aria-nova/ui/button"
import { Calendar } from "@/styles/aria-nova/ui/calendar"
import { Popover, PopoverTrigger } from "@/styles/aria-nova/ui/popover"

export function DatePickerDemo() {
  const [date, setDate] = React.useState<CalendarDate | null>(null)

  return (
    <PopoverTrigger>
      <Button
        variant={"outline"}
        data-empty={!date}
        className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
      >
        {date ? (
          date
            .toDate(getLocalTimeZone())
            .toLocaleDateString(undefined, { dateStyle: "long" })
        ) : (
          <span>Pick a date</span>
        )}
        <ChevronDownIcon data-icon="inline-end" />
      </Button>
      <Popover className="w-auto p-0" placement="bottom start">
        <Calendar value={date} onChange={setDate} />
      </Popover>
    </PopoverTrigger>
  )
}
