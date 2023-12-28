"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york/ui/button"
import { Calendar } from "@/registry/new-york/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover"

export default function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
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
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
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
        <PopoverContent className="w-auto p-0" align="start">
          <div className="w-full flex justify-start p-2">
            <Button
              variant={"outline"}
              onClick={() => handlePresetSelect("last7Days")}
            >
              Last 7 Days
            </Button>
            <Button
              variant={"outline"}
              onClick={() => handlePresetSelect("last30Days")}
            >
              Last 30 Days
            </Button>
            <Button
              variant={"outline"}
              onClick={() => handlePresetSelect("monthToDate")}
            >
              Month to Date
            </Button>
            <Button
              variant={"outline"}
              onClick={() => handlePresetSelect("yearToDate")}
            >
              Year to Date
            </Button>
          </div>
          <div className="border-t">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
