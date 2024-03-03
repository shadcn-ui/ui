"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format, startOfMonth, startOfYear, subDays } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/default/ui/button"
import { Calendar } from "@/registry/default/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select"

interface DateRangePreset {
  key: string
  label: string
  range: {
    from: Date
    to?: Date
  }
}

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  showExternalPresets?: boolean
  showInternalPresets?: boolean
  numberOfMonths?: 2 | 3 | 4 | 5 | 6
  presets?: DateRangePreset[]
}

export function DateRangePicker({
  showExternalPresets,
  showInternalPresets,
  numberOfMonths = 2,
  presets,
  className,
}: DateRangePickerProps) {
  const defaultPresets: DateRangePreset[] = [
    {
      key: "today",
      label: "Today",
      range: {
        from: new Date(),
        to: new Date(),
      },
    },
    {
      key: "yesterday",
      label: "Yesterday",
      range: {
        from: subDays(new Date(), 1),
        to: subDays(new Date(), 1),
      },
    },
    {
      key: "last_7_days",
      label: "Last 7 Days",
      range: {
        from: subDays(new Date(), 6),
        to: new Date(),
      },
    },
    {
      key: "last_30_days",
      label: "Last 30 Days",
      range: {
        from: subDays(new Date(), 29),
        to: new Date(),
      },
    },
    {
      key: "month_to_date",
      label: "Month to Date",
      range: {
        from: startOfMonth(new Date()),
        to: new Date(),
      },
    },
    {
      key: "year_to_date",
      label: "Year to Date",
      range: {
        from: startOfYear(new Date()),
        to: new Date(),
      },
    },
    {
      key: "this_year",
      label: "This Year",
      range: {
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(),
      },
    },
  ]

  const allPresets = presets ?? defaultPresets

  const [date, setDate] = React.useState<DateRange | undefined>()

  const handlePresetSelect = (preset: DateRangePreset) => {
    setDate({
      from: preset.range.from,
      to: preset.range.to,
    })
  }

  return (
    <div className={cn("inline-flex", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
              showExternalPresets && "rounded-r-none"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          {showInternalPresets ? (
            <>
              <div className="flex">
                <div className="justify-evenly p-2">
                  <div className="text-muted-foreground">
                    <span className="font-bold underline">Presets</span>
                  </div>
                  {allPresets.map((preset) => (
                    <div
                      key={preset.key}
                      role="button"
                      className="text-sm text-muted-foreground hover:text-primary"
                      onClick={() => handlePresetSelect(preset)}
                    >
                      {preset.label}
                    </div>
                  ))}
                </div>
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={numberOfMonths}
                />
              </div>
            </>
          ) : (
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={numberOfMonths}
            />
          )}
        </PopoverContent>
      </Popover>
      {showExternalPresets && (
        <Select
          onValueChange={(value) => {
            setDate(undefined)
            const selectedPreset = allPresets.find(
              (preset) => preset.key === value
            )
            if (selectedPreset) {
              handlePresetSelect(selectedPreset)
            }
          }}
        >
          <SelectTrigger className="w-[140px] rounded-l-none border-l-0">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent position="popper">
            {allPresets.map((preset) => (
              <SelectItem key={preset.key} value={preset.key}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
