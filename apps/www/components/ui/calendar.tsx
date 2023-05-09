"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  startCalendarAt?: number
  endCalendarAt?: number
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  startCalendarAt = 1970,
  endCalendarAt = 2070,
  ...props
}: CalendarProps) {
  const [focusedMonth, setFocusedMonth] = React.useState(new Date())

  const focusedMonthMonthString = focusedMonth.toLocaleString("default", {
    month: "long",
  })
  const focusedMonthYearString = focusedMonth.toLocaleString("default", {
    year: "numeric",
  })

  const allMonthNames = Array.from({ length: 12 }, (_, i) =>
    new Date(new Date().setMonth(i)).toLocaleString("default", {
      month: "long",
    })
  )
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        Caption: () => (
          <div className="space-around flex flex-row justify-center gap-4">
            <Select
              value={focusedMonthMonthString}
              onValueChange={(value) => {
                const newFocusedMonth = new Date(focusedMonth)
                newFocusedMonth.setMonth(allMonthNames.indexOf(value))
                setFocusedMonth(newFocusedMonth)
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allMonthNames.map((monthName) => (
                  <SelectItem key={monthName} value={monthName}>
                    {monthName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={focusedMonthYearString}
              onValueChange={(value) => {
                const newFocusedMonth = new Date(focusedMonth)
                newFocusedMonth.setFullYear(parseInt(value))
                setFocusedMonth(newFocusedMonth)
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from(
                  { length: endCalendarAt - startCalendarAt },
                  (_, i) => (
                    <SelectItem
                      key={i}
                      value={(i + startCalendarAt + 1).toString()}
                    >
                      {i + startCalendarAt + 1}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        ),
      }}
      onMonthChange={(month) => setFocusedMonth(month)}
      month={focusedMonth}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
