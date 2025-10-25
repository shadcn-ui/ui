"use client"

import * as React from "react"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york/ui/button"
import { Label } from "@/registry/new-york/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover"

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
    return Math.floor((currentYear - 1) / 12) * 12 + 1
  })

  React.useEffect(() => {
    setStartYear(Math.floor((selectedYear - 1) / 12) * 12 + 1)
  }, [selectedYear])

  const years = Array.from({ length: 12 }, (_, i) => startYear + i)

  const handlePrevious = () => {
    setStartYear((prev) => prev - 12)
  }

  const handleNext = () => {
    setStartYear((prev) => prev + 12)
  }

  const handleYearClick = (year: number) => {
    onYearSelect(year)
    onModeChange("month")
  }

  return (
    <div className={cn("w-[280px] p-3", className)}>
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
        {years.map((year) => {
          const isSelected = year === selectedYear
          return (
            <Button
              key={year}
              variant={isSelected ? "default" : "ghost"}
              size="sm"
              className="hover:bg-accent hover:text-accent-foreground h-8 text-sm"
              onClick={() => handleYearClick(year)}
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
    <div className={cn("w-[280px] p-3", className)}>
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

function CalendarDayButton(props: React.ComponentProps<typeof DayButton>) {
  const { day, modifiers, ...buttonProps } = props
  const { buttonVariant } = React.useContext(CalendarContext)

  return (
    <Button
      variant={modifiers.selected ? "default" : buttonVariant}
      size="icon"
      className={cn(
        "h-8 w-8 p-0 font-normal transition-colors",
        modifiers.selected && "text-primary-foreground",
        modifiers.today &&
          !modifiers.selected &&
          "bg-accent text-accent-foreground",
        modifiers.outside && "text-muted-foreground opacity-50",
        modifiers.disabled && "text-muted-foreground opacity-50",
        modifiers.range_middle && "rounded-none",
        modifiers.range_start && "rounded-l-md",
        modifiers.range_end && "rounded-r-md"
      )}
      {...buttonProps}
    >
      {day.date.getDate()}
    </Button>
  )
}

const CalendarContext = React.createContext<{
  buttonVariant: React.ComponentProps<typeof Button>["variant"]
}>({
  buttonVariant: "ghost",
})

function EnhancedCalendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
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

  if (selectionMode === "year") {
    return (
      <YearSelection
        selectedYear={displayMonth.getFullYear()}
        onYearSelect={handleYearSelect}
        onModeChange={setSelectionMode}
        className={className}
      />
    )
  }

  if (selectionMode === "month") {
    return (
      <MonthSelection
        selectedMonth={displayMonth.getMonth()}
        selectedYear={displayMonth.getFullYear()}
        onMonthSelect={handleMonthSelect}
        onModeChange={setSelectionMode}
        onYearChange={handleYearChange}
        className={className}
      />
    )
  }

  return (
    <div
      className={cn(
        "bg-background group/calendar w-[280px] p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
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
            {displayMonth.toLocaleString(undefined, { month: "short" })}
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

      <CalendarContext.Provider value={{ buttonVariant }}>
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
            root: cn("w-fit", getDefaultClassNames().root),
            months: cn(
              "relative flex flex-col gap-4 md:flex-row",
              getDefaultClassNames().months
            ),
            month: cn(
              "flex w-full flex-col gap-4",
              getDefaultClassNames().month
            ),
            nav: cn("hidden", getDefaultClassNames().nav),
            month_caption: cn("hidden", getDefaultClassNames().month_caption),
            table: "w-full border-collapse",
            weekdays: cn("flex", getDefaultClassNames().weekdays),
            weekday: cn(
              "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
              getDefaultClassNames().weekday
            ),
            week: cn("mt-2 flex w-full", getDefaultClassNames().week),
            day: cn(
              "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
              getDefaultClassNames().day
            ),
            range_start: cn(
              "bg-accent rounded-l-md",
              getDefaultClassNames().range_start
            ),
            range_middle: cn(
              "rounded-none",
              getDefaultClassNames().range_middle
            ),
            range_end: cn(
              "bg-accent rounded-r-md",
              getDefaultClassNames().range_end
            ),
            today: cn(
              "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
              getDefaultClassNames().today
            ),
            outside: cn(
              "text-muted-foreground aria-selected:text-muted-foreground",
              getDefaultClassNames().outside
            ),
            disabled: cn(
              "text-muted-foreground opacity-50",
              getDefaultClassNames().disabled
            ),
            hidden: cn("invisible", getDefaultClassNames().hidden),
            ...classNames,
          }}
          components={{
            DayButton: CalendarDayButton,
            ...components,
          }}
          {...props}
        />
      </CalendarContext.Provider>
    </div>
  )
}

export default function Calendar33() {
  const [date, setDate] = React.useState<Date>()

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        Select date with enhanced picker
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Pick a date"}
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <EnhancedCalendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
