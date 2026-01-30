"use client"

import * as React from "react"
import { format } from "date-fns"
import { Clock3Icon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
import { TimePicker } from "@/registry/new-york-v4/ui/time-picker"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"

export function TimePickerDemo() {
  return (
    <div className="flex w-full flex-col gap-8 md:flex-row">
      <BasicTimePicker />
      <TimePickerWithPresets />
    </div>
  )
}

function BasicTimePicker() {
  const [value, setValue] = React.useState<Date | undefined>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "min-w-[200px] justify-start px-2 font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <Clock3Icon className="text-muted-foreground mr-2 size-4" />
          {value ? format(value, "h:mm a") : <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="start">
        <TimePicker value={value} onValueChange={setValue} />
      </PopoverContent>
    </Popover>
  )
}

const PRESETS = [
  { label: "08:00", hour: 8, minute: 0 },
  { label: "09:30", hour: 9, minute: 30 },
  { label: "12:00", hour: 12, minute: 0 },
  { label: "14:30", hour: 14, minute: 30 },
]

function TimePickerWithPresets() {
  const [value, setValue] = React.useState<Date>(() => {
    const now = new Date()
    now.setHours(9, 30, 0, 0)
    return now
  })

  const applyPreset = React.useCallback((preset: (typeof PRESETS)[number]) => {
    setValue((previous) => {
      const next = previous ? new Date(previous) : new Date()
      next.setHours(preset.hour)
      next.setMinutes(preset.minute)
      next.setSeconds(0)
      next.setMilliseconds(0)
      return next
    })
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <TimePicker
        value={value}
        onValueChange={setValue}
        hourCycle={24}
        minuteStep={15}
        hideLabels
      />
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => {
          const isActive =
            value.getHours() === preset.hour &&
            value.getMinutes() === preset.minute

          return (
            <Button
              key={preset.label}
              size="sm"
              variant={isActive ? "default" : "outline"}
              onClick={() => applyPreset(preset)}
              className="font-medium"
            >
              {preset.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
