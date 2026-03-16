"use client"

import * as React from "react"
import { DatePicker } from "@ark-ui/react/date-picker"
import type { DateValue } from "@internationalized/date"

import { cn } from "@/examples/ark/lib/utils"
import { Button, buttonVariants } from "@/examples/ark/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

type SelectionMode = "single" | "multiple" | "range"

interface CalendarProps
  extends Omit<React.ComponentProps<typeof DatePicker.Root>, "selectionMode"> {
  className?: string
  showOutsideDays?: boolean
  mode?: SelectionMode
  selected?: DateValue[]
  onSelect?: (details: { value: DateValue[]; valueAsString: string[] }) => void
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
  numOfMonths?: number
  fixedWeeks?: boolean
  startOfWeek?: number
}

function Calendar({
  className,
  showOutsideDays = true,
  mode = "single",
  selected,
  onSelect,
  buttonVariant = "ghost",
  locale,
  numOfMonths = 1,
  fixedWeeks,
  startOfWeek,
  ...props
}: CalendarProps) {
  return (
    <DatePicker.Root
      selectionMode={mode}
      value={selected}
      onValueChange={
        onSelect
          ? (details) =>
              onSelect({
                value: details.value,
                valueAsString: details.valueAsString,
              })
          : undefined
      }
      locale={locale}
      numOfMonths={numOfMonths}
      fixedWeeks={fixedWeeks}
      startOfWeek={startOfWeek}
      open
      closeOnSelect={false}
      inline
      {...props}
    >
      <div
        data-slot="calendar"
        className={cn(
          "group/calendar w-fit bg-background p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
          className
        )}
      >
        <DatePicker.Content className="outline-none">
          <DatePicker.View view="day" className="flex flex-col gap-4">
            <DatePicker.Context>
              {(api) => (
                <>
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

                  <DatePicker.Table className="w-full border-collapse">
                    <DatePicker.TableHead>
                      <DatePicker.TableRow className="flex">
                        {api.weekDays.map((weekDay, i) => (
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
                      {api.weeks.map((week, weekIndex) => (
                        <DatePicker.TableRow
                          key={weekIndex}
                          className="mt-2 flex w-full"
                        >
                          {week.map((day, dayIndex) => {
                            const isOutside =
                              day.month !== api.focusedValue.month
                            if (!showOutsideDays && isOutside) {
                              return (
                                <td
                                  key={dayIndex}
                                  className="flex-1 p-0"
                                  aria-hidden
                                />
                              )
                            }
                            return (
                              <DatePicker.TableCell
                                key={dayIndex}
                                value={day}
                                className={cn(
                                  "group/day relative aspect-square h-full w-full flex-1 rounded-(--cell-radius) p-0 text-center select-none",
                                  "[&:last-child[data-selected]_div]:rounded-r-(--cell-radius)",
                                  "[&:first-child[data-selected]_div]:rounded-l-(--cell-radius)"
                                )}
                              >
                                <DatePicker.TableCellTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                      "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal",
                                      "data-[selected]:bg-primary data-[selected]:text-primary-foreground",
                                      "data-[today]:bg-muted data-[today]:text-foreground data-[today]:data-[selected]:rounded-none",
                                      "data-[outside-range]:text-muted-foreground data-[outside-range]:aria-selected:text-muted-foreground",
                                      "data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
                                      "data-[in-range]:rounded-none data-[in-range]:bg-muted data-[in-range]:text-foreground",
                                      "data-[range-start]:rounded-(--cell-radius) data-[range-start]:rounded-l-(--cell-radius) data-[range-start]:bg-primary data-[range-start]:text-primary-foreground",
                                      "data-[range-end]:rounded-(--cell-radius) data-[range-end]:rounded-r-(--cell-radius) data-[range-end]:bg-primary data-[range-end]:text-primary-foreground",
                                      "dark:hover:text-foreground [&>span]:text-xs [&>span]:opacity-70",
                                      "focus-visible:relative focus-visible:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    )}
                                  />
                                </DatePicker.TableCellTrigger>
                              </DatePicker.TableCell>
                            )
                          })}
                        </DatePicker.TableRow>
                      ))}
                    </DatePicker.TableBody>
                  </DatePicker.Table>
                </>
              )}
            </DatePicker.Context>
          </DatePicker.View>

          <DatePicker.View view="month" className="flex flex-col gap-4">
            <DatePicker.Context>
              {(api) => (
                <>
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
                                    {month.label}
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

          <DatePicker.View view="year" className="flex flex-col gap-4">
            <DatePicker.Context>
              {(api) => (
                <>
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

                  <DatePicker.Table className="w-full border-collapse">
                    <DatePicker.TableBody>
                      {api
                        .getYearsGrid({ columns: 4 })
                        .map((years, rowIndex) => (
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
                                    {year.label}
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
        </DatePicker.Content>
      </div>
    </DatePicker.Root>
  )
}

export { Calendar }
export type { CalendarProps }
