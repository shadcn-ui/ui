"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { type DateRange } from "react-day-picker"
import { es } from "react-day-picker/locale"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/registry/radix/ui/button"
import { Calendar, CalendarDayButton } from "@/registry/radix/ui/calendar"
import { Card, CardContent, CardFooter } from "@/registry/radix/ui/card"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/radix/ui/drawer"
import { Input } from "@/registry/radix/ui/input"
import { Label } from "@/registry/radix/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/radix/ui/popover"
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export default function CalendarDemo() {
  return (
    <div className="bg-muted flex flex-1 flex-col flex-wrap justify-center gap-8 p-10 lg:flex-row">
      <CalendarSingle />
      <CalendarMultiple />
      <CalendarRange />
      <CalendarBookedDates />
      <CalendarRangeMultipleMonths />
      <CalendarWithTime />
      <CalendarWithPresets />
      <CalendarCustomDays />
      <div className="flex flex-col items-start gap-4 md:flex-row">
        <DatePickerSimple />
        <DataPickerWithDropdowns />
        <DatePickerWithRange />
      </div>
    </div>
  )
}

function CalendarSingle() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 12)
  )
  return (
    <div className="flex flex-col gap-3">
      <div className="px-2 text-center text-sm">Single Selection</div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border shadow-sm"
        captionLayout="dropdown"
      />
    </div>
  )
}

function CalendarMultiple() {
  return (
    <div className="flex flex-col gap-3">
      <div className="px-2 text-center text-sm">Multiple Selection</div>
      <Calendar mode="multiple" className="rounded-lg border shadow-sm" />
    </div>
  )
}

function CalendarRange() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 12),
    to: addDays(new Date(new Date().getFullYear(), 0, 12), 30),
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="px-2 text-center text-sm">Range Selection</div>
      <Calendar
        mode="range"
        defaultMonth={dateRange?.from}
        selected={dateRange}
        onSelect={setDateRange}
        numberOfMonths={2}
        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
        className="rounded-lg border shadow-sm"
      />
    </div>
  )
}

function CalendarRangeMultipleMonths() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 3, 12),
    to: addDays(new Date(new Date().getFullYear(), 3, 12), 60),
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="px-2 text-center text-sm">Range Selection + Locale</div>
      <Calendar
        mode="range"
        defaultMonth={range?.from}
        selected={range}
        onSelect={setRange}
        numberOfMonths={3}
        locale={es}
        fixedWeeks
        className="rounded-lg border shadow-sm"
      />
    </div>
  )
}

function CalendarBookedDates() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 3)
  )
  const bookedDates = Array.from(
    { length: 15 },
    (_, i) => new Date(new Date().getFullYear(), new Date().getMonth(), 12 + i)
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="px-2 text-center text-sm">With booked dates</div>
      <Calendar
        mode="single"
        defaultMonth={date}
        selected={date}
        onSelect={setDate}
        disabled={bookedDates}
        modifiers={{
          booked: bookedDates,
        }}
        modifiersClassNames={{
          booked: "[&>button]:line-through opacity-100",
        }}
        className="rounded-lg border shadow-sm"
      />
    </div>
  )
}

function CalendarWithTime() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 12)
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="px-2 text-center text-sm">With Time Input</div>
      <Card className="w-fit py-4">
        <CardContent className="px-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="p-0"
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-3 border-t px-4 pt-4">
          <div className="flex w-full flex-col gap-2">
            <Label htmlFor="time-from">Start Time</Label>
            <div className="relative flex w-full items-center gap-2">
              <IconPlaceholder
                icon="CalendarClock"
                className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none"
              />
              <Input
                id="time-from"
                type="time"
                step="1"
                defaultValue="10:30:00"
                className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            <Label htmlFor="time-to">End Time</Label>
            <div className="relative flex w-full items-center gap-2">
              <IconPlaceholder
                icon="CalendarClock"
                className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none"
              />
              <Input
                id="time-to"
                type="time"
                step="1"
                defaultValue="12:30:00"
                className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

function CalendarCustomDays() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 11, 8),
    to: addDays(new Date(new Date().getFullYear(), 11, 8), 10),
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="px-2 text-center text-sm">
        With Custom Days and Formatters
      </div>
      <Calendar
        mode="range"
        defaultMonth={range?.from}
        selected={range}
        onSelect={setRange}
        numberOfMonths={1}
        captionLayout="dropdown"
        className="rounded-lg border shadow-sm [--cell-size:--spacing(12)]"
        formatters={{
          formatMonthDropdown: (date) => {
            return date.toLocaleString("default", { month: "long" })
          },
        }}
        components={{
          DayButton: ({ children, modifiers, day, ...props }) => {
            const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6

            return (
              <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                {children}
                {!modifiers.outside && (
                  <span>{isWeekend ? "$120" : "$100"}</span>
                )}
              </CalendarDayButton>
            )
          },
        }}
      />
    </div>
  )
}

function CalendarWithPresets() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 12)
  )
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  )

  return (
    <div className="flex max-w-[300px] flex-col gap-3">
      <div className="px-2 text-center text-sm">With Presets</div>
      <Card className="w-fit py-4">
        <CardContent className="px-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            fixedWeeks
            className="p-0 [--cell-size:--spacing(9.5)]"
          />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t px-4 pt-4">
          {[
            { label: "Today", value: 0 },
            { label: "Tomorrow", value: 1 },
            { label: "In 3 days", value: 3 },
            { label: "In a week", value: 7 },
            { label: "In 2 weeks", value: 14 },
          ].map((preset) => (
            <Button
              key={preset.value}
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                const newDate = addDays(new Date(), preset.value)
                setDate(newDate)
                setCurrentMonth(
                  new Date(newDate.getFullYear(), newDate.getMonth(), 1)
                )
              }}
            >
              {preset.label}
            </Button>
          ))}
        </CardFooter>
      </Card>
    </div>
  )
}

function DatePickerSimple() {
  const [date, setDate] = React.useState<Date>()

  return (
    <div className="flex flex-col gap-3">
      <div className="px-2 text-center text-sm">Date Picker Simple</div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "min-w-[200px] justify-start px-2 font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <IconPlaceholder
              icon="DatePickerCalendar"
              className="text-muted-foreground"
            />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function DatePickerWithRange() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="px-2 text-center text-sm">Date Picker Range</div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-fit justify-start px-2 font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <IconPlaceholder
              icon="DatePickerCalendar"
              className="text-muted-foreground"
            />
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
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function DataPickerWithDropdowns() {
  const [date, setDate] = React.useState<Date>()
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile(450)

  return (
    <div className="flex flex-col gap-3">
      <div className="px-2 text-center text-sm">Date Picker with Dropdowns</div>
      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "min-w-[200px] justify-start px-2 font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
              <IconPlaceholder
                icon="DatePickerCalendar"
                className="text-muted-foreground ml-auto"
              />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="sr-only">
              <DrawerTitle>Select a date</DrawerTitle>
              <DrawerDescription>
                Pick a date for your appointment.
              </DrawerDescription>
            </DrawerHeader>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(day) => {
                setDate(day)
                setOpen(false)
              }}
            />
          </DrawerContent>
        </Drawer>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "min-w-[200px] justify-start px-2 font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
              <IconPlaceholder
                icon="DatePickerCalendar"
                className="text-muted-foreground ml-auto"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              captionLayout="dropdown"
            />
            <div className="flex gap-2 border-t p-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Done
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
