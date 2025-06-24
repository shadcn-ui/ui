"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/registry/new-york/ui/button"

type SelectionMode = "calendar" | "year" | "month"

interface YearSelectionProps {
  selectedYear: number
  onYearSelect: (year: number) => void
  onModeChange: (mode: SelectionMode) => void
  className?: string
}

function YearSelection({
  selectedYear,
  onYearSelect,
  onModeChange,
  className,
}: YearSelectionProps) {
  const [startYear, setStartYear] = React.useState(() => {
    const currentYear = new Date().getFullYear()
    return currentYear - 5
  })

  React.useEffect(() => {
    setStartYear(selectedYear - 5)
  }, [selectedYear])

  const years = Array.from({ length: 12 }, (_, i) => startYear + i)
  const displayYears = [startYear - 1, ...years, startYear + 12]

  const handlePrevious = () => {
    setStartYear((prev) => prev - 10)
  }

  const handleNext = () => {
    setStartYear((prev) => prev + 10)
  }

  const handleYearClick = (year: number) => {
    if (year === startYear - 1 || year === startYear + 12) return
    onYearSelect(year)
    onModeChange("month")
  }

  return (
    <div className={cn("p-3", className)}>
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handlePrevious}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          {startYear} - {startYear + 11}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleNext}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {displayYears.map((year) => {
          const isGrayed = year === startYear - 1 || year === startYear + 12
          const isSelected = year === selectedYear
          return (
            <Button
              key={year}
              variant={isSelected ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-8 text-sm",
                isGrayed && "text-muted-foreground cursor-default opacity-50",
                !isGrayed &&
                  !isSelected &&
                  "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => handleYearClick(year)}
              disabled={isGrayed}
            >
              {year}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

interface MonthSelectionProps {
  selectedMonth: number
  selectedYear: number
  onMonthSelect: (month: number) => void
  onModeChange: (mode: SelectionMode) => void
  onYearChange: (year: number) => void
  className?: string
}

function MonthSelection({
  selectedMonth,
  selectedYear,
  onMonthSelect,
  onModeChange,
  onYearChange,
  className,
}: MonthSelectionProps) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  const handlePrevious = () => {
    onYearChange(selectedYear - 1)
  }

  const handleNext = () => {
    onYearChange(selectedYear + 1)
  }

  const handleMonthClick = (monthIndex: number) => {
    onMonthSelect(monthIndex)
    onModeChange("calendar")
  }

  return (
    <div className={cn("p-3", className)}>
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handlePrevious}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="h-8 px-2 text-sm font-medium"
          onClick={() => onModeChange("year")}
        >
          {selectedYear}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleNext}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {months.map((month, index) => {
          const isSelected = index === selectedMonth
          return (
            <Button
              key={month}
              variant={isSelected ? "default" : "ghost"}
              size="sm"
              className="hover:bg-accent hover:text-accent-foreground h-8 text-sm"
              onClick={() => handleMonthClick(index)}
            >
              {month}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  enableCustomYearMonthPicker = false,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
  enableCustomYearMonthPicker?: boolean
}) {
  const defaultClassNames = getDefaultClassNames()
  const [selectionMode, setSelectionMode] =
    React.useState<SelectionMode>("calendar")
  const [displayMonth, setDisplayMonth] = React.useState(() => {
    const selected = (props as any).selected
    return selected instanceof Date ? selected : new Date()
  })

  React.useEffect(() => {
    const selected = (props as any).selected
    if (selected instanceof Date) {
      setDisplayMonth(selected)
    }
  }, [(props as any).selected])

  const handleYearSelect = (year: number) => {
    const newDate = new Date(displayMonth)
    newDate.setFullYear(year)
    setDisplayMonth(newDate)
  }

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(displayMonth)
    newDate.setMonth(month)
    setDisplayMonth(newDate)
  }

  const handleYearChange = (year: number) => {
    const newDate = new Date(displayMonth)
    newDate.setFullYear(year)
    setDisplayMonth(newDate)
  }

  if (enableCustomYearMonthPicker && selectionMode === "year") {
    return (
      <div
        className={cn(
          "bg-background group/calendar [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
          className
        )}
      >
        <YearSelection
          selectedYear={displayMonth.getFullYear()}
          onYearSelect={handleYearSelect}
          onModeChange={setSelectionMode}
        />
      </div>
    )
  }

  if (enableCustomYearMonthPicker && selectionMode === "month") {
    return (
      <div
        className={cn(
          "bg-background group/calendar [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
          className
        )}
      >
        <MonthSelection
          selectedMonth={displayMonth.getMonth()}
          selectedYear={displayMonth.getFullYear()}
          onMonthSelect={handleMonthSelect}
          onModeChange={setSelectionMode}
          onYearChange={handleYearChange}
        />
      </div>
    )
  }

  if (enableCustomYearMonthPicker) {
    return (
      <div
        className={cn(
          "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
          className
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              const newDate = new Date(displayMonth)
              newDate.setMonth(newDate.getMonth() - 1)
              setDisplayMonth(newDate)
            }}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 font-medium"
              onClick={() => setSelectionMode("month")}
            >
              {displayMonth.toLocaleString(undefined, {
                month: "short",
              })}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 font-medium"
              onClick={() => setSelectionMode("year")}
            >
              {displayMonth.getFullYear()}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              const newDate = new Date(displayMonth)
              newDate.setMonth(newDate.getMonth() + 1)
              setDisplayMonth(newDate)
            }}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>

        <DayPicker
          showOutsideDays={showOutsideDays}
          month={displayMonth}
          onMonthChange={setDisplayMonth}
          className={cn("[&_.rdp-nav]:hidden", "[&_.rdp-caption]:hidden")}
          formatters={{
            formatMonthDropdown: (date) =>
              date.toLocaleString("default", { month: "short" }),
            ...formatters,
          }}
          classNames={{
            root: cn("w-fit", defaultClassNames.root),
            months: cn(
              "relative flex flex-col gap-4 md:flex-row",
              defaultClassNames.months
            ),
            month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
            nav: cn("hidden", defaultClassNames.nav),
            month_caption: cn("hidden", defaultClassNames.month_caption),
            table: "w-full border-collapse",
            weekdays: cn("flex", defaultClassNames.weekdays),
            weekday: cn(
              "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
              defaultClassNames.weekday
            ),
            week: cn("mt-2 flex w-full", defaultClassNames.week),
            day: cn(
              "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
              defaultClassNames.day
            ),
            range_start: cn(
              "bg-accent rounded-l-md",
              defaultClassNames.range_start
            ),
            range_middle: cn("rounded-none", defaultClassNames.range_middle),
            range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
            today: cn(
              "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
              defaultClassNames.today
            ),
            outside: cn(
              "text-muted-foreground aria-selected:text-muted-foreground",
              defaultClassNames.outside
            ),
            disabled: cn(
              "text-muted-foreground opacity-50",
              defaultClassNames.disabled
            ),
            hidden: cn("invisible", defaultClassNames.hidden),
            ...classNames,
          }}
          components={{
            DayButton: CalendarDayButton,
            ...components,
          }}
          {...props}
        />
      </div>
    )
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-[--cell-size] select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn(
          "bg-accent rounded-l-md",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
