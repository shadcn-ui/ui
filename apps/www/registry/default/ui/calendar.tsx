"use client"

import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react"
import { DayPicker, type DayPickerProps } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/registry/default/ui/button"

export type CalendarProps = DayPickerProps

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "relative",
        month: "space-y-4",
        nav: "flex items-center justify-between absolute w-full z-10 px-1",
        button_previous: cn(
          buttonVariants({
            variant: "outline",
            className:
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          })
        ),
        button_next: cn(
          buttonVariants({
            variant: "outline",
            className:
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          })
        ),
        month_caption: "flex justify-center items-center h-7",
        caption_label: "text-sm font-medium",
        month_grid: "border-collapse space-y-1",
        weekdays: "flex",
        weekday: "text-muted-foreground w-9 font-normal text-xs",
        weeks: "",
        week: "flex mt-2",
        day: cn(
          buttonVariants({
            variant: "ghost",
            className:
              "h-9 w-9 p-0 font-normal aria-selected:opacity-100 relative overflow-hidden",
          })
        ),
        day_button: "w-full h-full absolute",
        today: "bg-accent text-accent-foreground",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        range_end: "day-range-end",
        ...classNames,
      }}
      components={{
        Chevron({ orientation, disabled, className }) {
          const Component =
            orientation === "left"
              ? ChevronLeft
              : orientation === "right"
              ? ChevronRight
              : orientation === "up"
              ? ChevronUp
              : ChevronDown

          return (
            <Component
              className={cn("w-4 h-4", className)}
              aria-disabled={disabled}
            />
          )
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
