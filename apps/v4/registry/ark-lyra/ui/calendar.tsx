"use client"

import * as React from "react"
import {
  DatePicker,
  type DatePickerValueChangeDetails,
} from "@ark-ui/react/date-picker"

import { cn } from "@/registry/ark-lyra/lib/utils"
import { Button } from "@/registry/ark-lyra/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function Calendar({
  className,
  showOutsideDays = true,
  buttonVariant = "ghost",
  ...props
}: Omit<React.ComponentProps<typeof DatePicker.Root>, "inline"> & {
  className?: string
  showOutsideDays?: boolean
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  return (
    <DatePicker.Root inline {...props}>
      <div
        data-slot="calendar"
        className={cn(
          "p-2 [--cell-size:--spacing(7)] group/calendar w-fit bg-background in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
          className
        )}
      >
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
                      <IconPlaceholder
                        lucide="ChevronLeftIcon"
                        tabler="IconChevronLeft"
                        hugeicons="ArrowLeftIcon"
                        phosphor="CaretLeftIcon"
                        remixicon="RiArrowLeftSLine"
                        className="cn-rtl-flip size-4"
                      />
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
                      <IconPlaceholder
                        lucide="ChevronRightIcon"
                        tabler="IconChevronRight"
                        hugeicons="ArrowRightIcon"
                        phosphor="CaretRightIcon"
                        remixicon="RiArrowRightSLine"
                        className="cn-rtl-flip size-4"
                      />
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
                              <DatePicker.TableCellTrigger
                                className={cn(
                                  "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) items-center justify-center gap-1 rounded-(--cell-radius) border-0 text-sm leading-none font-normal",
                                  "hover:bg-accent hover:text-accent-foreground",
                                  "data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground",
                                  "data-[today]:bg-accent data-[today]:text-accent-foreground",
                                  "data-[outside-range]:text-muted-foreground/50",
                                  "data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
                                  "data-[in-range]:bg-accent data-[in-range]:text-accent-foreground data-[in-range]:rounded-none",
                                  "data-[range-start]:rounded-l-(--cell-radius) data-[range-start]:bg-primary data-[range-start]:text-primary-foreground",
                                  "data-[range-end]:rounded-r-(--cell-radius) data-[range-end]:bg-primary data-[range-end]:text-primary-foreground",
                                  "focus-visible:relative focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
                                )}
                              >
                                {day.day}
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
                      <IconPlaceholder
                        lucide="ChevronLeftIcon"
                        tabler="IconChevronLeft"
                        hugeicons="ArrowLeftIcon"
                        phosphor="CaretLeftIcon"
                        remixicon="RiArrowLeftSLine"
                        className="cn-rtl-flip size-4"
                      />
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
                      <IconPlaceholder
                        lucide="ChevronRightIcon"
                        tabler="IconChevronRight"
                        hugeicons="ArrowRightIcon"
                        phosphor="CaretRightIcon"
                        remixicon="RiArrowRightSLine"
                        className="cn-rtl-flip size-4"
                      />
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
                      <IconPlaceholder
                        lucide="ChevronLeftIcon"
                        tabler="IconChevronLeft"
                        hugeicons="ArrowLeftIcon"
                        phosphor="CaretLeftIcon"
                        remixicon="RiArrowLeftSLine"
                        className="cn-rtl-flip size-4"
                      />
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
                      <IconPlaceholder
                        lucide="ChevronRightIcon"
                        tabler="IconChevronRight"
                        hugeicons="ArrowRightIcon"
                        phosphor="CaretRightIcon"
                        remixicon="RiArrowRightSLine"
                        className="cn-rtl-flip size-4"
                      />
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
      </div>
    </DatePicker.Root>
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
        "data-[in-range]:bg-accent data-[in-range]:text-accent-foreground data-[in-range]:rounded-none",
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

export { Calendar, CalendarDayButton }
export {
  useDatePicker,
  useDatePickerContext,
  type DatePickerValueChangeDetails,
  type DatePickerOpenChangeDetails,
} from "@ark-ui/react/date-picker"
export { CalendarDate, type DateValue } from "@internationalized/date"
