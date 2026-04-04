"use client"

import * as React from "react"
import { cn } from "@/examples/ark/lib/utils"
import { Button } from "@/examples/ark/ui/button"
import {
  DatePicker,
  type DatePickerValueChangeDetails,
} from "@ark-ui/react/date-picker"
import { type DateValue } from "@internationalized/date"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

function CalendarViewHeader({
  buttonVariant = "ghost",
}: {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  return (
    <DatePicker.ViewControl className="relative flex w-full items-center justify-between gap-1">
      <DatePicker.PrevTrigger asChild>
        <Button
          variant={buttonVariant}
          size="icon"
          className="size-(--cell-size) p-0 select-none aria-disabled:opacity-50"
        >
          <ChevronLeftIcon className="cn-rtl-flip size-4" />
        </Button>
      </DatePicker.PrevTrigger>

      <DatePicker.ViewTrigger className="flex h-(--cell-size) items-center justify-center text-sm font-medium select-none">
        <DatePicker.RangeText />
      </DatePicker.ViewTrigger>

      <DatePicker.NextTrigger asChild>
        <Button
          variant={buttonVariant}
          size="icon"
          className="size-(--cell-size) p-0 select-none aria-disabled:opacity-50"
        >
          <ChevronRightIcon className="cn-rtl-flip size-4" />
        </Button>
      </DatePicker.NextTrigger>
    </DatePicker.ViewControl>
  )
}

function CalendarSelectHeader({
  buttonVariant = "ghost",
  className,
}: {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
  className?: string
}) {
  return (
    <DatePicker.ViewControl
      className={cn(
        "relative flex w-full items-center justify-between gap-1",
        className
      )}
    >
      <DatePicker.PrevTrigger asChild>
        <Button
          variant={buttonVariant}
          size="icon"
          className="size-(--cell-size) p-0 select-none aria-disabled:opacity-50"
        >
          <ChevronLeftIcon className="cn-rtl-flip size-4" />
        </Button>
      </DatePicker.PrevTrigger>

      <div className="flex items-center gap-1">
        <span className="relative">
          <DatePicker.MonthSelect className="appearance-none rounded-md bg-transparent py-1 pr-6 pl-2 text-sm font-medium outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50" />
          <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-1 size-3.5 -translate-y-1/2 text-muted-foreground" />
        </span>
        <span className="relative">
          <DatePicker.YearSelect className="appearance-none rounded-md bg-transparent py-1 pr-6 pl-2 text-sm font-medium outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50" />
          <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-1 size-3.5 -translate-y-1/2 text-muted-foreground" />
        </span>
      </div>

      <DatePicker.NextTrigger asChild>
        <Button
          variant={buttonVariant}
          size="icon"
          className="size-(--cell-size) p-0 select-none aria-disabled:opacity-50"
        >
          <ChevronRightIcon className="cn-rtl-flip size-4" />
        </Button>
      </DatePicker.NextTrigger>
    </DatePicker.ViewControl>
  )
}

function CalendarDayView({
  showOutsideDays = true,
  header,
  cell,
}: {
  showOutsideDays?: boolean
  header?: React.ReactNode
  cell?: (day: DateValue) => React.ReactNode
}) {
  return (
    <DatePicker.View view="day" className="flex flex-col gap-4">
      <DatePicker.Context>
        {(api) => (
          <>
            {header ?? <CalendarSelectHeader />}
            <CalendarDayTable
              weeks={api.weeks}
              weekDays={api.weekDays}
              focusedMonth={api.focusedValue.month}
              showOutsideDays={showOutsideDays}
              cell={cell}
            />
          </>
        )}
      </DatePicker.Context>
    </DatePicker.View>
  )
}

function CalendarMonthView({
  header,
  cell,
}: {
  header?: React.ReactNode
  cell?: (month: { label: string; value: number }) => React.ReactNode
}) {
  return (
    <DatePicker.View view="month" className="flex flex-col gap-4">
      <DatePicker.Context>
        {(api) => (
          <>
            {header ?? <CalendarSelectHeader />}
            <DatePicker.Table className="w-full border-collapse">
              <DatePicker.TableBody>
                {api
                  .getMonthsGrid({ columns: 4, format: "short" })
                  .map((months, rowIndex) => (
                    <DatePicker.TableRow
                      key={rowIndex}
                      className="mt-2 flex w-full"
                    >
                      {months.map((month, colIndex) => (
                        <DatePicker.TableCell
                          key={colIndex}
                          value={month.value}
                          className="flex-1 p-0 text-center"
                        >
                          <DatePicker.TableCellTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full text-sm font-normal"
                            >
                              {cell ? cell(month) : month.label}
                            </Button>
                          </DatePicker.TableCellTrigger>
                        </DatePicker.TableCell>
                      ))}
                    </DatePicker.TableRow>
                  ))}
              </DatePicker.TableBody>
            </DatePicker.Table>
          </>
        )}
      </DatePicker.Context>
    </DatePicker.View>
  )
}

function CalendarYearView({
  header,
  cell,
}: {
  header?: React.ReactNode
  cell?: (year: { label: string; value: number }) => React.ReactNode
}) {
  return (
    <DatePicker.View view="year" className="flex flex-col gap-4">
      <DatePicker.Context>
        {(api) => (
          <>
            {header ?? <CalendarSelectHeader />}
            <DatePicker.Table className="w-full border-collapse">
              <DatePicker.TableBody>
                {api.getYearsGrid({ columns: 4 }).map((years, rowIndex) => (
                  <DatePicker.TableRow
                    key={rowIndex}
                    className="mt-2 flex w-full"
                  >
                    {years.map((year, colIndex) => (
                      <DatePicker.TableCell
                        key={colIndex}
                        value={year.value}
                        className="flex-1 p-0 text-center"
                      >
                        <DatePicker.TableCellTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full text-sm font-normal"
                          >
                            {cell ? cell(year) : year.label}
                          </Button>
                        </DatePicker.TableCellTrigger>
                      </DatePicker.TableCell>
                    ))}
                  </DatePicker.TableRow>
                ))}
              </DatePicker.TableBody>
            </DatePicker.Table>
          </>
        )}
      </DatePicker.Context>
    </DatePicker.View>
  )
}

function CalendarDayButton({
  children,
  className,
  ...props
}: React.ComponentProps<typeof DatePicker.TableCellTrigger>) {
  return (
    <DatePicker.TableCellTrigger
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) items-center justify-center gap-1 rounded-(--cell-radius) border-0 text-sm leading-none font-normal",
        "hover:bg-accent hover:text-accent-foreground",
        "data-[selected]:bg-primary data-[selected]:text-primary-foreground",
        "data-[today]:bg-accent data-[today]:text-accent-foreground",
        "data-[outside-range]:text-muted-foreground/50",
        "data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
        "data-[unavailable]:text-muted-foreground data-[unavailable]:line-through data-[unavailable]:opacity-40",
        "data-[in-range]:rounded-none data-[in-range]:bg-accent data-[in-range]:text-accent-foreground",
        "data-[range-start]:rounded-l-(--cell-radius) data-[range-start]:bg-primary data-[range-start]:text-primary-foreground",
        "data-[range-end]:rounded-r-(--cell-radius) data-[range-end]:bg-primary data-[range-end]:text-primary-foreground",
        "focus-visible:relative focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
        className
      )}
      {...props}
    >
      {children}
    </DatePicker.TableCellTrigger>
  )
}

function CalendarDayTable({
  weeks,
  weekDays,
  focusedMonth,
  showOutsideDays = true,
  visibleRange,
  cell,
}: {
  weeks: DateValue[][]
  weekDays: { short: string }[]
  focusedMonth: number
  showOutsideDays?: boolean
  visibleRange?: { start: DateValue; end: DateValue }
  cell?: (day: DateValue) => React.ReactNode
}) {
  return (
    <DatePicker.Table className="w-full border-collapse">
      <DatePicker.TableHead>
        <DatePicker.TableRow className="flex">
          {weekDays.map((weekDay, i) => (
            <DatePicker.TableHeader
              key={i}
              className="flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none"
            >
              {weekDay.short}
            </DatePicker.TableHeader>
          ))}
        </DatePicker.TableRow>
      </DatePicker.TableHead>
      <DatePicker.TableBody>
        {weeks.map((week, weekIndex) => (
          <DatePicker.TableRow key={weekIndex} className="mt-2 flex w-full">
            {week.map((day, dayIndex) => {
              const isOutside = day.month !== focusedMonth
              if (!showOutsideDays && isOutside) {
                return (
                  <td key={dayIndex} className="flex-1 p-0" aria-hidden />
                )
              }
              return (
                <DatePicker.TableCell
                  key={dayIndex}
                  value={day}
                  visibleRange={visibleRange}
                  className={cn(
                    "group/day relative aspect-square h-full w-full flex-1 rounded-(--cell-radius) p-0 text-center select-none",
                    "[&:last-child[data-selected]_div]:rounded-r-(--cell-radius)",
                    "[&:first-child[data-selected]_div]:rounded-l-(--cell-radius)"
                  )}
                >
                  <CalendarDayButton>
                    {cell ? cell(day) : day.day}
                  </CalendarDayButton>
                </DatePicker.TableCell>
              )
            })}
          </DatePicker.TableRow>
        ))}
      </DatePicker.TableBody>
    </DatePicker.Table>
  )
}

function CalendarDualMonthDayView({
  showOutsideDays = true,
  cell,
}: {
  showOutsideDays?: boolean
  cell?: (day: DateValue) => React.ReactNode
}) {
  return (
    <DatePicker.View view="day" className="flex flex-col gap-4">
      <DatePicker.Context>
        {(api) => {
          const offset = api.getOffset({ months: 1 })
          return (
            <div className="flex flex-col gap-4 md:flex-row">
              {/* First month */}
              <div className="flex flex-col gap-4">
                <div className="relative flex w-full items-center justify-between gap-1">
                  <DatePicker.PrevTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-(--cell-size) p-0 select-none aria-disabled:opacity-50"
                    >
                      <ChevronLeftIcon className="cn-rtl-flip size-4" />
                    </Button>
                  </DatePicker.PrevTrigger>
                  <span className="text-sm font-medium select-none">
                    {api.visibleRangeText.start}
                  </span>
                  <div className="size-(--cell-size)" />
                </div>
                <CalendarDayTable
                  weeks={api.weeks}
                  weekDays={api.weekDays}
                  focusedMonth={api.focusedValue.month}
                  showOutsideDays={showOutsideDays}
                  cell={cell}
                />
              </div>
              {/* Second month */}
              <div className="flex flex-col gap-4">
                <div className="relative flex w-full items-center justify-between gap-1">
                  <div className="size-(--cell-size)" />
                  <span className="text-sm font-medium select-none">
                    {api.visibleRangeText.end}
                  </span>
                  <DatePicker.NextTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-(--cell-size) p-0 select-none aria-disabled:opacity-50"
                    >
                      <ChevronRightIcon className="cn-rtl-flip size-4" />
                    </Button>
                  </DatePicker.NextTrigger>
                </div>
                <CalendarDayTable
                  weeks={offset.weeks}
                  weekDays={api.weekDays}
                  focusedMonth={offset.visibleRange.start.month}
                  showOutsideDays={showOutsideDays}
                  visibleRange={offset.visibleRange}
                  cell={cell}
                />
              </div>
            </div>
          )
        }}
      </DatePicker.Context>
    </DatePicker.View>
  )
}

function Calendar({
  className,
  showOutsideDays = true,
  children,
  numOfMonths,
  ...props
}: Omit<React.ComponentProps<typeof DatePicker.Root>, "inline"> & {
  className?: string
  showOutsideDays?: boolean
  children?: React.ReactNode
}) {
  const isDualMonth = numOfMonths && numOfMonths >= 2

  return (
    <DatePicker.Root inline numOfMonths={numOfMonths} {...props}>
      <div
        data-slot="calendar"
        className={cn(
          "group/calendar w-fit bg-background p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
          className
        )}
      >
        {children || (
          <>
            {isDualMonth ? (
              <CalendarDualMonthDayView
                showOutsideDays={showOutsideDays}
              />
            ) : (
              <CalendarDayView showOutsideDays={showOutsideDays} />
            )}
            <CalendarMonthView />
            <CalendarYearView />
          </>
        )}
      </div>
    </DatePicker.Root>
  )
}

const CalendarPresetTrigger = DatePicker.PresetTrigger

export {
  Calendar,
  CalendarDayView,
  CalendarDualMonthDayView,
  CalendarDayTable,
  CalendarMonthView,
  CalendarYearView,
  CalendarViewHeader,
  CalendarSelectHeader,
  CalendarDayButton,
  CalendarPresetTrigger,
}
export {
  useDatePicker,
  useDatePickerContext,
  type DatePickerValueChangeDetails,
  type DatePickerOpenChangeDetails,
} from "@ark-ui/react/date-picker"
export { CalendarDate, type DateValue } from "@internationalized/date"
