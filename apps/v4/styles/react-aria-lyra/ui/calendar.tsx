"use client"

import * as React from "react"
import { type CalendarDate } from "@internationalized/date"
import { cva } from "class-variance-authority"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import {
  Calendar as AriaCalendar,
  CalendarGridHeader as AriaCalendarGridHeader,
  RangeCalendar as AriaRangeCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarHeaderCell,
  CalendarStateContext,
  Heading,
  RangeCalendarStateContext,
  useLocale,
  type CalendarCellRenderProps,
  type CalendarProps,
  type DateValue,
  type RangeCalendarProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/styles/react-aria-lyra/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/styles/react-aria-nova/ui/select"

const cellVariants = cva(
  "group/day relative mt-2 aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:is(:last-child>[data-selected=true])>div]:rounded-r-(--cell-radius)",
  {
    variants: {
      showWeekNumber: {
        false:
          "[&:is(:first-child>[data-selected=true])>div]:rounded-l-(--cell-radius)",
        true: "[&:is(:nth-child(2)>[data-selected=true])>div]:rounded-l-(--cell-radius)",
      },
      isToday: {
        true: "rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none",
      },
      isSelectionStart: {
        true: "relative isolate z-0 rounded-l-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted",
      },
      isSelectionEnd: {
        true: "relative isolate z-0 rounded-r-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted",
      },
      isUnavailable: {
        true: "text-muted-foreground opacity-50 [&>div]:line-through",
      },
      isDisabled: {
        true: "text-muted-foreground opacity-50",
      },
      isOutsideMonth: {
        true: "text-muted-foreground aria-selected:text-muted-foreground",
      },
    },
  }
)

function Calendar<T extends DateValue>(
  props: Omit<CalendarProps<T>, "visibleDuration"> & {
    buttonVariant?: React.ComponentProps<typeof Button>["variant"]
    captionLayout?: "label" | "dropdown"
    numberOfMonths?: number
    showWeekNumber?: boolean
    headerFormat?: Intl.DateTimeFormatOptions
    renderCell?: (
      renderProps: CalendarCellRenderProps & {
        defaultChildren: React.ReactNode
      }
    ) => React.ReactNode
  }
) {
  return (
    <AriaCalendar
      {...props}
      data-slot="calendar"
      visibleDuration={{ months: props.numberOfMonths || 1 }}
      className={cn(
        "group/calendar w-fit bg-background p-2 [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        props.className
      )}
    >
      <CalendarInner {...props} />
    </AriaCalendar>
  )
}

function RangeCalendar<T extends DateValue>(
  props: RangeCalendarProps<T> & {
    buttonVariant?: React.ComponentProps<typeof Button>["variant"]
    captionLayout?: "label" | "dropdown"
    headerFormat?: Intl.DateTimeFormatOptions
    numberOfMonths?: number
    showWeekNumber?: boolean
    renderCell?: (
      renderProps: CalendarCellRenderProps & {
        defaultChildren: React.ReactNode
      }
    ) => React.ReactNode
  }
) {
  return (
    <AriaRangeCalendar
      {...props}
      data-slot="calendar"
      visibleDuration={{ months: props.numberOfMonths || 1 }}
      className={cn(
        "group/calendar w-fit bg-background p-2 [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        props.className
      )}
    >
      <CalendarInner {...props} isRange />
    </AriaRangeCalendar>
  )
}

function CalendarInner({
  captionLayout = "label",
  buttonVariant = "ghost",
  numberOfMonths = 1,
  showWeekNumber = false,
  headerFormat,
  renderCell,
  isRange,
}: {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
  captionLayout?: "label" | "dropdown"
  numberOfMonths?: number
  showWeekNumber?: boolean
  headerFormat?: Intl.DateTimeFormatOptions
  renderCell?: (
    renderProps: CalendarCellRenderProps & { defaultChildren: React.ReactNode }
  ) => React.ReactNode
  isRange?: boolean
}) {
  return (
    <div className="relative flex flex-col gap-4 md:flex-row">
      <header className="absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1">
        <Button
          variant={buttonVariant}
          slot="previous"
          className="size-(--cell-size) p-0 select-none aria-disabled:opacity-50"
        >
          <ChevronLeftIcon className="cn-rtl-flip size-4" />
        </Button>
        <Button
          variant={buttonVariant}
          slot="next"
          className="size-(--cell-size) p-0 select-none aria-disabled:opacity-50"
        >
          <ChevronRightIcon className="cn-rtl-flip size-4" />
        </Button>
      </header>
      {Array.from({ length: numberOfMonths }, (_, i) => (
        <div key={i} className="flex w-full flex-col gap-4">
          <div className="flex h-(--cell-size) w-full items-center justify-center gap-1 px-(--cell-size)">
            {captionLayout === "dropdown" ? (
              <>
                <MonthDropdown format={headerFormat} />
                <YearDropdown format={headerFormat} />
              </>
            ) : (
              <MonthHeading offset={i} format={headerFormat} />
            )}
          </div>
          <CalendarGrid
            className="w-full border-collapse"
            offset={{ months: i }}
          >
            <AriaCalendarGridHeader>
              {(day) => (
                <CalendarHeaderCell className="rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none">
                  {day}
                </CalendarHeaderCell>
              )}
            </AriaCalendarGridHeader>
            <CalendarGridBody>
              {(date) => (
                <CalendarCell
                  date={date}
                  className={(renderProps) =>
                    cellVariants({ ...renderProps, showWeekNumber })
                  }
                >
                  {(renderProps) => (
                    <div
                      data-selected-single={renderProps.isSelected && !isRange}
                      data-range-start={renderProps.isSelectionStart && isRange}
                      data-range-end={renderProps.isSelectionEnd && isRange}
                      data-range-middle={
                        renderProps.isSelected &&
                        !renderProps.isSelectionStart &&
                        !renderProps.isSelectionEnd &&
                        isRange
                      }
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "relative isolate z-10 flex aspect-square h-full w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-muted data-[range-middle=true]:text-foreground data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground dark:hover:text-foreground [&>span]:text-xs [&>span]:opacity-70"
                      )}
                    >
                      {renderCell
                        ? renderCell(renderProps)
                        : renderProps.defaultChildren}
                    </div>
                  )}
                </CalendarCell>
              )}
            </CalendarGridBody>
          </CalendarGrid>
        </div>
      ))}
    </div>
  )
}

function MonthHeading({
  offset,
  format,
}: {
  offset: number
  format?: Intl.DateTimeFormatOptions
}) {
  const calendarState = React.useContext(CalendarStateContext)
  const rangeCalendarState = React.useContext(RangeCalendarStateContext)
  const state = calendarState || rangeCalendarState!
  const currentMonth = state.visibleRange.start.add({ months: offset })
  const { locale } = useLocale()
  const formatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: format?.month || "long",
        year: format?.year || "numeric",
        era:
          currentMonth &&
          currentMonth.calendar.identifier === "gregory" &&
          currentMonth.era === "BC"
            ? "short"
            : undefined,
        calendar: state.visibleRange?.start.calendar.identifier,
        timeZone: state.timeZone,
      }),
    [format, locale, currentMonth, state.visibleRange, state.timeZone]
  )

  return (
    <Heading className="text-sm font-medium select-none">
      {formatter.format(currentMonth.toDate(state.timeZone))}
    </Heading>
  )
}

interface MonthItem {
  id: number
  date: CalendarDate
  formatted: string
}

export function MonthDropdown({
  format,
}: {
  format?: Intl.DateTimeFormatOptions
}) {
  const calendarState = React.useContext(CalendarStateContext)
  const rangeCalendarState = React.useContext(RangeCalendarStateContext)
  const state = calendarState || rangeCalendarState!
  const { locale } = useLocale()
  const formatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: format?.month || "short",
        timeZone: state.timeZone,
      }),
    [format, locale, state.timeZone]
  )

  // Format the name of each month in the year according to the
  // current locale and calendar system. Note that in some calendar
  // systems, such as the Hebrew, the number of months may differ
  // between years.
  const months: MonthItem[] = []
  const numMonths = state.focusedDate.calendar.getMonthsInYear(
    state.focusedDate
  )
  for (let i = 1; i <= numMonths; i++) {
    const date = state.focusedDate.set({ month: i })
    months.push({
      id: i,
      date,
      formatted: formatter.format(date.toDate(state.timeZone)),
    })
  }

  return (
    <Select
      aria-label="Month"
      className="relative"
      value={state.focusedDate.month}
      onChange={(key) => {
        if (typeof key === "number") {
          state.setFocusedDate(months[key - 1].date)
        }
      }}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="min-w-0">
        <SelectGroup>
          {months.map((item) => (
            <SelectItem key={item.id} id={item.id}>
              {item.formatted}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

interface YearItem {
  id: number
  date: CalendarDate
  formatted: string
}

export function YearDropdown({
  format,
}: {
  format?: Intl.DateTimeFormatOptions
}) {
  const calendarState = React.useContext(CalendarStateContext)
  const rangeCalendarState = React.useContext(RangeCalendarStateContext)
  const state = calendarState || rangeCalendarState!
  const { locale } = useLocale()
  const formatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        year: format?.year || "numeric",
        timeZone: state.timeZone,
      }),
    [format, locale, state.timeZone]
  )

  // Format 20 years on each side of the current year according
  // to the current locale and calendar system.
  const years: YearItem[] = []
  for (let i = -10; i <= 10; i++) {
    const date = state.focusedDate.add({ years: i })
    years.push({
      // Use the index as the id so we can retrieve the full
      // date object from the list in onChange. We cannot only
      // store the year number, because in some calendars, such
      // as the Japanese, the era may also change.
      id: years.length,
      date,
      formatted: formatter.format(date.toDate(state.timeZone)),
    })
  }

  return (
    <Select
      aria-label="Year"
      className="relative"
      // The selected year is always at the center of the 20 year range we display.
      value={10}
      onChange={(key) => {
        if (typeof key === "number") {
          state.setFocusedDate(years[key].date)
        }
      }}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="min-w-0">
        {years.map((item) => (
          <SelectItem key={item.id} id={item.id}>
            {item.formatted}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { Calendar, RangeCalendar }
