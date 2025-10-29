"use client"

import * as React from "react"
import { addDays, isAfter, isBefore, isSameDay, subDays } from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import { DateAfter, DateBefore, DateRange } from "react-day-picker"

import { Button } from "@/registry/new-york-v4/ui/button"
import { Calendar } from "@/registry/new-york-v4/ui/calendar"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york-v4/ui/tabs"

export default function Calendar33() {
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 5, 23),
  })
  const [tab, setTab] = React.useState<"from" | "to">("from")

  let rangeMiddle: DateRange | DateBefore | DateAfter | undefined = undefined

  if (dateRange.to && dateRange.from) {
    //If the from and to dates are the same day or adjacent days, there are no days in between
    if (
      isSameDay(dateRange.from, dateRange.to) ||
      isSameDay(dateRange.from, subDays(dateRange.to, 1))
    ) {
      rangeMiddle = undefined
    } else {
      rangeMiddle = {
        from: addDays(dateRange.from, 1),
        to: subDays(dateRange.to, 1),
      }
    }
  } else if (!dateRange.from && dateRange.to) {
    rangeMiddle = { before: dateRange.to }
  } else if (dateRange.from && !dateRange.to) {
    rangeMiddle = { after: dateRange.from }
  }

  let selectedRange: DateRange | DateBefore | DateAfter | undefined = undefined

  if (dateRange.from && dateRange.to) {
    selectedRange = { from: dateRange.from, to: dateRange.to }
  } else if (!dateRange.from && dateRange.to) {
    selectedRange = { before: dateRange.to }
  } else if (dateRange.from && !dateRange.to) {
    selectedRange = { after: dateRange.from }
  }

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="dates" className="px-1">
        Select a date range
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="dates"
            className="w-56 justify-between font-normal"
          >
            {formatDateRange(dateRange)}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as "from" | "to")}
            className="p-2"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="from">
                <span className="text-xs">
                  From{" "}
                  {dateRange.from ? dateRange.from.toLocaleDateString() : ""}
                </span>
              </TabsTrigger>
              <TabsTrigger value="to">
                <span className="text-xs">
                  To {dateRange.to ? dateRange.to.toLocaleDateString() : ""}
                </span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="from">
              <Calendar
                className="flex justify-center pt-0"
                //Instead of using the range mode, we use 2 single calendars and handle the range logic manually
                mode="single"
                selected={dateRange?.from}
                onSelect={(newDateFrom) => {
                  if (!newDateFrom) {
                    return setDateRange({ ...dateRange, from: undefined })
                  }
                  setTab("to")
                  if (
                    dateRange.to &&
                    newDateFrom &&
                    isAfter(newDateFrom, dateRange.to)
                  ) {
                    //If the new from date is after the to date, set the to date to undefined
                    setDateRange({ from: newDateFrom, to: undefined })
                  } else {
                    setDateRange({ ...dateRange, from: newDateFrom })
                  }
                }}
                defaultMonth={dateRange?.from}
                //Manually set the modifiers to handle the range logic (due to using 2 single calendars instead of the range mode)
                modifiers={{
                  selected: selectedRange,
                  range_start: dateRange.from,
                  range_end: dateRange.to,
                  range_middle: rangeMiddle,
                }}
              />
            </TabsContent>
            <TabsContent value="to">
              <Calendar
                className="flex justify-center pt-0"
                buttonVariant="ghost"
                //Instead of using the range mode, we use 2 single calendars and handle the range logic manually
                mode="single"
                selected={dateRange?.to}
                onSelect={(newDateTo) => {
                  if (!newDateTo) {
                    return setDateRange({ ...dateRange, to: undefined })
                  }
                  if (
                    dateRange.from &&
                    newDateTo &&
                    isBefore(newDateTo, dateRange.from)
                  ) {
                    //If the new to date is before the from date, set the from date to undefined
                    setDateRange({ from: undefined, to: newDateTo })
                  } else {
                    setDateRange({ ...dateRange, to: newDateTo })
                  }
                }}
                defaultMonth={dateRange?.to}
                //Manually set the modifiers to handle the range logic (due to using 2 single calendars instead of the range mode)
                modifiers={{
                  selected: selectedRange,
                  range_start: dateRange.from,
                  range_end: dateRange.to,
                  range_middle: rangeMiddle,
                }}
              />
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  )
}

const formatDateRange = (dateRange: DateRange) => {
  if (!dateRange.from && !dateRange.to) return "Select date..."
  if (dateRange.from && !dateRange.to)
    return `From ${dateRange.from.toLocaleDateString()}`
  if (!dateRange.from && dateRange.to)
    return `To ${dateRange.to.toLocaleDateString()}`
  if (dateRange.from && dateRange.to) {
    if (isSameDay(dateRange.from, dateRange.to))
      return dateRange.from.toLocaleDateString()
    return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
  }
}
