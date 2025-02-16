"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/registry/default/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components,
  captionLayout = "buttons",
  ...props
}: CalendarProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const moved = React.useRef(false)

  function updateUILayoutFull() {
    if (moved.current) return

    const captionWrap = ref.current?.querySelector(".caption-wrap")
    if (!captionWrap) return

    const captionNav = captionWrap.querySelector(".caption-nav")
    if (!captionNav) return

    const labelElement = captionWrap.querySelector(".caption_label")
    const prevMontButton = captionNav.querySelector(
      "button[name='previous-month']"
    )
    const nextMontButton = captionNav.querySelector("button[name='next-month']")
    if (!labelElement || !prevMontButton || !nextMontButton) return

    prevMontButton.parentNode?.insertBefore(labelElement, nextMontButton)
    moved.current = true

    if (captionLayout !== "dropdown-buttons") return

    let captionElement = captionWrap.querySelector(".caption-element")
    if (!captionElement) return

    captionElement.classList.toggle("hidden")
    labelElement.classList.remove("hidden")
    labelElement.classList.add(
      "cursor-pointer",
      "select-none",
      "hover:bg-gray-100",
      "active:bg-gray-200",
      "p-1",
      "rounded-md"
    )
    labelElement.addEventListener("click", () => {
      captionElement.classList.toggle("hidden")
    })
  }

  React.useEffect(updateUILayoutFull, [captionLayout])

  return (
    <div ref={ref}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={{
          months:
            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: cn(
            "caption-wrap relative flex items-center justify-between gap-2 pt-1",
            {
              "flex-col-reverse": captionLayout === "dropdown-buttons",
            }
          ),
          caption_label: "caption_label text-sm font-medium",
          nav: "caption-nav justify-between w-full flex items-center space-x-1",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "prev-month",
          nav_button_next: "next-month",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          vhidden: "hidden",
          dropdown:
            "h-fit p-1 border rounded-md focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-ring",
          dropdown_year: "[&>div]:hidden",
          dropdown_month: "[&>div]:hidden",
          caption_dropdowns:
            "caption-element flex w-full justify-between gap-4",
          ...classNames,
        }}
        components={{
          IconLeft: ({ className, ...props }) => (
            <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
          ),
          IconRight: ({ className, ...props }) => (
            <ChevronRight className={cn("h-4 w-4", className)} {...props} />
          ),
          ...components,
        }}
        captionLayout={captionLayout}
        {...props}
      />
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
