"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import {
  Calendar as AriaCalendar,
  CalendarGridHeader as AriaCalendarGridHeader,
  RangeCalendar as AriaRangeCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarHeaderCell,
  CalendarHeading,
  CalendarMonthPicker,
  CalendarYearPicker,
  type CalendarCellRenderProps,
  type CalendarProps,
  type DateValue,
  type RangeCalendarProps,
} from "react-aria-components"

import { cn } from "@/registry/bases/aria/lib/utils"
import { Button, buttonVariants } from "@/registry/bases/aria/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/aria/ui/select"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const cellVariants = cva(
  "group/day relative mt-2 aspect-square h-full w-full cursor-default rounded-(--cell-radius) p-0 text-center select-none [&:is(:last-child>[data-selected=true])>div]:rounded-r-(--cell-radius)",
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

function Calendar<
  T extends DateValue,
  M extends "single" | "multiple" = "single",
>(
  props: Omit<CalendarProps<T, M>, "visibleDuration"> & {
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
        "cn-calendar group/calendar w-fit bg-background in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
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
        "cn-calendar group/calendar w-fit bg-background in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
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
          <IconPlaceholder
            lucide="ChevronLeftIcon"
            tabler="IconChevronLeft"
            hugeicons="ArrowLeftIcon"
            phosphor="CaretLeftIcon"
            remixicon="RiArrowLeftSLine"
            className="cn-rtl-flip size-4"
          />
        </Button>
        <Button
          variant={buttonVariant}
          slot="next"
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
              <CalendarHeading
                offset={{ months: i }}
                format={headerFormat}
                className="cn-calendar-caption text-sm font-medium select-none"
              />
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
                        "cn-calendar-day-button relative isolate z-10 flex aspect-square h-full w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-muted data-[range-middle=true]:text-foreground data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground dark:hover:text-foreground [&>span]:text-xs [&>span]:opacity-70"
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

function MonthDropdown({ format }: { format?: Intl.DateTimeFormatOptions }) {
  return (
    <CalendarMonthPicker format={format?.month}>
      {(props) => (
        <Select {...props} className="relative">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="min-w-0">
            <SelectGroup>
              {props.items.map((item) => (
                <SelectItem key={item.id} id={item.id}>
                  {item.formatted}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </CalendarMonthPicker>
  )
}

function YearDropdown({ format }: { format?: Intl.DateTimeFormatOptions }) {
  return (
    <CalendarYearPicker format={format}>
      {(props) => (
        <Select {...props} className="relative">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="min-w-0">
            {props.items.map((item) => (
              <SelectItem key={item.id} id={item.id}>
                {item.formatted}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </CalendarYearPicker>
  )
}

export { Calendar, RangeCalendar }
