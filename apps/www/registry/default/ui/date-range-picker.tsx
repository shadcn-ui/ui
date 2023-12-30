"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
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

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  showExternalPresets?: boolean
  showInternalPresets?: boolean
  numberOfMonths?: 2 | 3 | 4 | 5 | 6
}

export function DateRangePicker({
  showExternalPresets,
  showInternalPresets,
  numberOfMonths = 2,
  className,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2023, 0, 20),
    to: addDays(new Date(2023, 0, 20), 20),
  })

  const handlePresetSelect = (value: string) => {
    switch (value) {
      case "last7Days":
        setDate({
          from: addDays(new Date(), -7),
          to: new Date(),
        })
        break
      case "last30Days":
        setDate({
          from: addDays(new Date(), -30),
          to: new Date(),
        })
        break
      case "monthToDate":
        setDate({
          from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          to: new Date(),
        })
        break
      case "yearToDate":
        setDate({
          from: new Date(new Date().getFullYear(), 0, 1),
          to: new Date(),
        })
        break
      case "thisYear":
        setDate({
          from: new Date(new Date().getFullYear(), 0, 1),
          to: new Date(new Date().getFullYear(), 11, 31),
        })
        break
      case "lastYear":
        setDate({
          from: new Date(new Date().getFullYear() - 1, 0, 1),
          to: new Date(new Date().getFullYear() - 1, 11, 31),
        })
        break
      default:
        break
    }
  }

  return (
    <div className={cn("inline-flex", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
              showExternalPresets && "rounded-r-none",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
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
                  <div
                    className="text-muted-foreground"
                    onClick={() => handlePresetSelect("last7Days")}
                  >
                    <span className="font-bold underline">Presets</span>
                  </div>
                  <div
                    role="button"
                    className="text-sm text-muted-foreground hover:text-primary"
                    onClick={() => handlePresetSelect("last7Days")}
                  >
                    Last 7 Days
                  </div>
                  <div
                    role="button"
                    className="text-sm text-muted-foreground hover:text-primary"
                    onClick={() => handlePresetSelect("last30Days")}
                  >
                    Last 30 Days
                  </div>
                  <div
                    role="button"
                    className="text-sm text-muted-foreground hover:text-primary"
                    onClick={() => handlePresetSelect("monthToDate")}
                  >
                    Month to Date
                  </div>
                  <div
                    role="button"
                    className="text-sm text-muted-foreground hover:text-primary"
                    onClick={() => handlePresetSelect("yearToDate")}
                  >
                    Year to Date
                  </div>
                  <div
                    role="button"
                    className="text-sm text-muted-foreground hover:text-primary"
                    onClick={() => handlePresetSelect("thisYear")}
                  >
                    This Year
                  </div>
                  <div
                    role="button"
                    className="text-sm text-muted-foreground hover:text-primary"
                    onClick={() => handlePresetSelect("lastYear")}
                  >
                    Last Year
                  </div>
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
            handlePresetSelect(value)
          }}
        >
          <SelectTrigger className="w-[140px] rounded-l-none border-l-0">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="last7Days">Last 7 Days</SelectItem>
            <SelectItem value="last30Days">Last 30 Days</SelectItem>
            <SelectItem value="monthToDate">Month to Date</SelectItem>
            <SelectItem value="yearToDate">Year to Date</SelectItem>
            <SelectItem value="thisYear">This Year</SelectItem>
            <SelectItem value="lastYear">Last Year</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
