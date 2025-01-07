"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayFlag, DayPicker, SelectionState, UI } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/registry/new-york/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3 w-fit', className)}
      classNames={{
        months: 'flex flex-col sm:space-x-4 sm:space-y-0 relative',
        month: 'space-y-4 !m-0',
        [UI.MonthCaption]:
          'flex justify-center pt-1 absolute top-0 items-center w-full',
        caption_label: 'text-sm font-medium ',
        [UI.Nav]:
          'space-x-1 flex items-center justify-between flex-row-reverse z-40 px-1',
        [UI.PreviousMonthButton]: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        [UI.NextMonthButton]: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        [UI.MonthGrid]: 'w-full border-collapse space-y-1',
        [UI.Weekdays]: 'flex',
        [UI.Weekday]:
          'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        [UI.Week]: 'flex w-full mt-2',
        [UI.Day]: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
          'text-center text-sm relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20'
        ),
        [SelectionState.range_end]: 'day-range-end',
        [SelectionState.selected]:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        [DayFlag.today]: 'bg-accent text-accent-foreground',
        [DayFlag.outside]:
          'day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
        [DayFlag.disabled]: 'text-muted-foreground opacity-50',
        [SelectionState.range_middle]:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        [DayFlag.hidden]: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn('h-4 w-4', className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn('h-4 w-4', className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
