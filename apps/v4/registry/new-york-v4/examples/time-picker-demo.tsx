"use client"

import * as React from "react"
import { format } from "date-fns"
import { Clock3Icon } from "lucide-react"

import { Button } from "@/registry/new-york-v4/ui/button"
import { TimePicker } from "@/registry/new-york-v4/ui/time-picker"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"

export default function TimePickerDemo() {
  const [value, setValue] = React.useState<Date | undefined>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[220px] justify-start font-normal"
          data-empty={!value}
        >
          <Clock3Icon className="mr-2 size-4 opacity-50" />
          {value ? format(value, "h:mm a") : <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="start">
        <TimePicker value={value} onValueChange={setValue} />
      </PopoverContent>
    </Popover>
  )
}
