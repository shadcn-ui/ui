"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/registry/default/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/default/ui/select"
export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
  mode: 'range' | 'single'
  fromYear?: number
  toYear?: number
}
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {

  const handleCalendarChange = (_value: string, _e: React.ChangeEventHandler<HTMLSelectElement> | undefined) => {
    const _event = {
      target: {
        value: _value
      },
    } as React.ChangeEvent<HTMLSelectElement>
    _e && _e(_event);
  };
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}

      captionLayout={props.captionLayout}
      fromYear={props.fromYear} toYear={props.toYear}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center gap-2",
        caption_label: "flex text-sm font-medium justify-center grow",
        caption_dropdowns: "flex justify-center gap-1 grow dropdowns",
        vhidden: "hidden",
        nav: "flex items-center [&:has([name='previous-month'])]:order-first [&:has([name='next-month'])]:order-last",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 text-muted-foreground"
        ),
        nav_button_previous: cn('mr-1 py-4', {
          "absolute left-1": props.mode === 'single',
        }),
        nav_button_next: cn('ml-1 py-4', {
          "absolute right-1": props.mode === 'single',
        }),
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
        IconLeft: ({ ...props }) => <ChevronLeft className=" h-4  w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4  w-4" />,
        Dropdown: ({ ...props }) => (
          <Select
            onValueChange={(value) => {
              handleCalendarChange(value, props.onChange)
            }}
          >
            <SelectTrigger className="h-4 py-4">
              <SelectValue
                placeholder={props.caption} />
            </SelectTrigger>
            <SelectContent
              className="max-h-[260px]"
            >
              {
                React.Children.map(props.children, (child: any) => (
                  <SelectItem
                    key={child.props.value}
                    value={child.props.value}>{child.props.children}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
