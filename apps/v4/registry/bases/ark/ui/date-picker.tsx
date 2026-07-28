"use client"

import * as React from "react"
import { cn } from "@/registry/bases/ark/lib/utils"
import { Button } from "@/registry/bases/ark/ui/button"
import { DatePicker as DatePickerPrimitive } from "@ark-ui/react/date-picker"
import { Portal } from "@ark-ui/react/portal"
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

function DatePicker(
  props: React.ComponentProps<typeof DatePickerPrimitive.Root>
) {
  return <DatePickerPrimitive.Root {...props} />
}

const DatePickerLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<typeof DatePickerPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DatePickerPrimitive.Label
    ref={ref}
    data-slot="date-picker-label"
    className={cn("text-sm leading-none font-medium select-none", className)}
    {...props}
  />
))
DatePickerLabel.displayName = "DatePickerLabel"

const DatePickerControl = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof DatePickerPrimitive.Control>
>(({ className, ...props }, ref) => (
  <DatePickerPrimitive.Control
    ref={ref}
    data-slot="date-picker-control"
    className={cn("relative flex w-full items-center gap-2", className)}
    {...props}
  />
))
DatePickerControl.displayName = "DatePickerControl"

const DatePickerInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof DatePickerPrimitive.Input>
>(({ className, ...props }, ref) => (
  <DatePickerPrimitive.Input
    ref={ref}
    data-slot="date-picker-input"
    className={cn(
      "flex h-9 w-full flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[border-color,box-shadow] duration-150 outline-none",
      "placeholder:text-muted-foreground",
      "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
))
DatePickerInput.displayName = "DatePickerInput"

const DatePickerTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof DatePickerPrimitive.Trigger>
>(({ className, children, asChild, ...props }, ref) => {
  if (asChild) {
    return (
      <DatePickerPrimitive.Trigger
        ref={ref}
        asChild
        data-slot="date-picker-trigger"
        className={className}
        {...props}
      >
        {children}
      </DatePickerPrimitive.Trigger>
    )
  }

  return (
    <DatePickerPrimitive.Trigger
      ref={ref}
      data-slot="date-picker-trigger"
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-input bg-transparent text-muted-foreground shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 focus-visible:outline-none [&_svg]:size-4",
        className
      )}
      {...props}
    >
      {children ?? <CalendarIcon />}
    </DatePickerPrimitive.Trigger>
  )
})
DatePickerTrigger.displayName = "DatePickerTrigger"

const DatePickerClearTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof DatePickerPrimitive.ClearTrigger>
>(({ className, children, ...props }, ref) => (
  <DatePickerPrimitive.ClearTrigger
    ref={ref}
    data-slot="date-picker-clear-trigger"
    className={cn(
      "inline-flex items-center justify-center text-sm text-muted-foreground transition-colors hover:text-foreground",
      className
    )}
    {...props}
  >
    {children ?? "Clear"}
  </DatePickerPrimitive.ClearTrigger>
))
DatePickerClearTrigger.displayName = "DatePickerClearTrigger"

const DatePickerPositioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof DatePickerPrimitive.Positioner>
>(({ className, ...props }, ref) => (
  <DatePickerPrimitive.Positioner
    ref={ref}
    data-slot="date-picker-positioner"
    className={className}
    {...props}
  />
))
DatePickerPositioner.displayName = "DatePickerPositioner"

const DatePickerContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof DatePickerPrimitive.Content>
>(({ className, ...props }, ref) => (
  <Portal>
    <DatePickerPrimitive.Positioner data-slot="date-picker-positioner">
      <DatePickerPrimitive.Content
        ref={ref}
        data-slot="date-picker-content"
        className={cn(
          "z-50 rounded-lg border bg-popover p-2 text-popover-foreground shadow-lg outline-none",
          "[--cell-size:--spacing(7)] [--cell-radius:var(--radius-md)]",
          "origin-(--transform-origin)",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[98%]",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[98%]",
          className
        )}
        {...props}
      />
    </DatePickerPrimitive.Positioner>
  </Portal>
))
DatePickerContent.displayName = "DatePickerContent"

const DatePickerView = DatePickerPrimitive.View

const DatePickerViewControl = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof DatePickerPrimitive.ViewControl>
>(({ className, ...props }, ref) => (
  <DatePickerPrimitive.ViewControl
    ref={ref}
    data-slot="date-picker-view-control"
    className={cn(
      "relative flex w-full items-center justify-between gap-1",
      className
    )}
    {...props}
  />
))
DatePickerViewControl.displayName = "DatePickerViewControl"

const DatePickerViewTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof DatePickerPrimitive.ViewTrigger>
>(({ className, ...props }, ref) => (
  <DatePickerPrimitive.ViewTrigger
    ref={ref}
    data-slot="date-picker-view-trigger"
    className={cn(
      "flex h-(--cell-size) items-center justify-center text-sm font-medium select-none",
      className
    )}
    {...props}
  />
))
DatePickerViewTrigger.displayName = "DatePickerViewTrigger"

const DatePickerPrevTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof DatePickerPrimitive.PrevTrigger>
>(({ className, children, ...props }, ref) => (
  <DatePickerPrimitive.PrevTrigger
    ref={ref}
    asChild
    data-slot="date-picker-prev-trigger"
    {...props}
  >
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
        className
      )}
    >
      {children ?? <ChevronLeftIcon className="size-4" />}
    </Button>
  </DatePickerPrimitive.PrevTrigger>
))
DatePickerPrevTrigger.displayName = "DatePickerPrevTrigger"

const DatePickerNextTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof DatePickerPrimitive.NextTrigger>
>(({ className, children, ...props }, ref) => (
  <DatePickerPrimitive.NextTrigger
    ref={ref}
    asChild
    data-slot="date-picker-next-trigger"
    {...props}
  >
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
        className
      )}
    >
      {children ?? <ChevronRightIcon className="size-4" />}
    </Button>
  </DatePickerPrimitive.NextTrigger>
))
DatePickerNextTrigger.displayName = "DatePickerNextTrigger"

const DatePickerRangeText = DatePickerPrimitive.RangeText
const DatePickerValueText = DatePickerPrimitive.ValueText

const DatePickerTable = React.forwardRef<
  HTMLTableElement,
  React.ComponentProps<typeof DatePickerPrimitive.Table>
>(({ className, ...props }, ref) => (
  <DatePickerPrimitive.Table
    ref={ref}
    data-slot="date-picker-table"
    className={cn("w-full border-collapse", className)}
    {...props}
  />
))
DatePickerTable.displayName = "DatePickerTable"

const DatePickerTableHead = DatePickerPrimitive.TableHead
const DatePickerTableBody = DatePickerPrimitive.TableBody

const DatePickerTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.ComponentProps<typeof DatePickerPrimitive.TableRow>
>(({ className, ...props }, ref) => (
  <DatePickerPrimitive.TableRow
    ref={ref}
    data-slot="date-picker-table-row"
    className={cn("mt-2 flex w-full", className)}
    {...props}
  />
))
DatePickerTableRow.displayName = "DatePickerTableRow"

const DatePickerTableHeader = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<typeof DatePickerPrimitive.TableHeader>
>(({ className, ...props }, ref) => (
  <DatePickerPrimitive.TableHeader
    ref={ref}
    data-slot="date-picker-table-header"
    className={cn(
      "flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none",
      className
    )}
    {...props}
  />
))
DatePickerTableHeader.displayName = "DatePickerTableHeader"

const DatePickerTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<typeof DatePickerPrimitive.TableCell>
>(({ className, ...props }, ref) => (
  <DatePickerPrimitive.TableCell
    ref={ref}
    data-slot="date-picker-table-cell"
    className={cn(
      "group/day relative aspect-square h-full w-full flex-1 rounded-(--cell-radius) p-0 text-center select-none",
      "[&:last-child[data-selected]_div]:rounded-r-(--cell-radius)",
      "[&:first-child[data-selected]_div]:rounded-l-(--cell-radius)",
      className
    )}
    {...props}
  />
))
DatePickerTableCell.displayName = "DatePickerTableCell"

const DatePickerTableCellTrigger = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof DatePickerPrimitive.TableCellTrigger>
>(({ className, ...props }, ref) => (
  <DatePickerPrimitive.TableCellTrigger
    ref={ref}
    data-slot="date-picker-table-cell-trigger"
    className={cn(
      "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) items-center justify-center gap-1 rounded-(--cell-radius) border-0 text-sm leading-none font-normal",
      "hover:bg-accent hover:text-accent-foreground",
      "data-[today]:bg-accent data-[today]:text-accent-foreground",
      "data-[selected]:bg-primary data-[selected]:text-primary-foreground",
      "data-[in-range]:rounded-none data-[in-range]:bg-accent data-[in-range]:text-accent-foreground",
      "data-[range-start]:rounded-l-(--cell-radius) data-[range-start]:bg-primary data-[range-start]:text-primary-foreground",
      "data-[range-end]:rounded-r-(--cell-radius) data-[range-end]:bg-primary data-[range-end]:text-primary-foreground",
      "data-[outside-range]:text-muted-foreground/50",
      "data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
      "data-[unavailable]:text-muted-foreground data-[unavailable]:line-through data-[unavailable]:opacity-40",
      "focus-visible:relative focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
      className
    )}
    {...props}
  />
))
DatePickerTableCellTrigger.displayName = "DatePickerTableCellTrigger"

const DatePickerMonthSelect = DatePickerPrimitive.MonthSelect
const DatePickerYearSelect = DatePickerPrimitive.YearSelect
const DatePickerPresetTrigger = DatePickerPrimitive.PresetTrigger
const DatePickerContext = DatePickerPrimitive.Context
const DatePickerRootProvider = DatePickerPrimitive.RootProvider

// --- Composed View Helpers ---

function DatePickerSelectHeader({
  className,
}: {
  className?: string
}) {
  return (
    <DatePickerViewControl className={className}>
      <DatePickerPrevTrigger />

      <div className="flex items-center gap-1">
        <span className="relative">
          <DatePickerMonthSelect className="appearance-none rounded-md bg-transparent py-1 pr-6 pl-2 text-sm font-medium outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50" />
          <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-1 size-3.5 -translate-y-1/2 text-muted-foreground" />
        </span>
        <span className="relative">
          <DatePickerYearSelect className="appearance-none rounded-md bg-transparent py-1 pr-6 pl-2 text-sm font-medium outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50" />
          <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-1 size-3.5 -translate-y-1/2 text-muted-foreground" />
        </span>
      </div>

      <DatePickerNextTrigger />
    </DatePickerViewControl>
  )
}

function DatePickerDayView({ className }: { className?: string }) {
  return (
    <DatePickerView
      view="day"
      className={cn("flex flex-col gap-4", className)}
    >
      <DatePickerContext>
        {(api) => (
          <>
            <DatePickerSelectHeader />
            <DatePickerTable>
              <DatePickerTableHead>
                <DatePickerTableRow>
                  {api.weekDays.map((day, i) => (
                    <DatePickerTableHeader key={i}>
                      {day.short}
                    </DatePickerTableHeader>
                  ))}
                </DatePickerTableRow>
              </DatePickerTableHead>
              <DatePickerTableBody>
                {api.weeks.map((week, i) => (
                  <DatePickerTableRow key={i}>
                    {week.map((day, j) => (
                      <DatePickerTableCell key={j} value={day}>
                        <DatePickerTableCellTrigger>
                          {day.day}
                        </DatePickerTableCellTrigger>
                      </DatePickerTableCell>
                    ))}
                  </DatePickerTableRow>
                ))}
              </DatePickerTableBody>
            </DatePickerTable>
          </>
        )}
      </DatePickerContext>
    </DatePickerView>
  )
}

function DatePickerMonthView({ className }: { className?: string }) {
  return (
    <DatePickerView
      view="month"
      className={cn("flex flex-col gap-4", className)}
    >
      <DatePickerContext>
        {(api) => (
          <>
            <DatePickerViewControl>
              <DatePickerPrevTrigger />
              <DatePickerViewTrigger>
                <DatePickerRangeText />
              </DatePickerViewTrigger>
              <DatePickerNextTrigger />
            </DatePickerViewControl>
            <DatePickerTable>
              <DatePickerTableBody>
                {api
                  .getMonthsGrid({ columns: 4, format: "short" })
                  .map((months, i) => (
                    <DatePickerTableRow key={i}>
                      {months.map((month, j) => (
                        <DatePickerTableCell
                          key={j}
                          value={month.value}
                          className="flex-1 p-0 text-center"
                        >
                          <DatePickerPrimitive.TableCellTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full text-sm font-normal"
                            >
                              {month.label}
                            </Button>
                          </DatePickerPrimitive.TableCellTrigger>
                        </DatePickerTableCell>
                      ))}
                    </DatePickerTableRow>
                  ))}
              </DatePickerTableBody>
            </DatePickerTable>
          </>
        )}
      </DatePickerContext>
    </DatePickerView>
  )
}

function DatePickerYearView({ className }: { className?: string }) {
  return (
    <DatePickerView
      view="year"
      className={cn("flex flex-col gap-4", className)}
    >
      <DatePickerContext>
        {(api) => (
          <>
            <DatePickerViewControl>
              <DatePickerPrevTrigger />
              <DatePickerViewTrigger>
                <DatePickerRangeText />
              </DatePickerViewTrigger>
              <DatePickerNextTrigger />
            </DatePickerViewControl>
            <DatePickerTable>
              <DatePickerTableBody>
                {api.getYearsGrid({ columns: 4 }).map((years, i) => (
                  <DatePickerTableRow key={i}>
                    {years.map((year, j) => (
                      <DatePickerTableCell
                        key={j}
                        value={year.value}
                        className="flex-1 p-0 text-center"
                      >
                        <DatePickerPrimitive.TableCellTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full text-sm font-normal"
                          >
                            {year.label}
                          </Button>
                        </DatePickerPrimitive.TableCellTrigger>
                      </DatePickerTableCell>
                    ))}
                  </DatePickerTableRow>
                ))}
              </DatePickerTableBody>
            </DatePickerTable>
          </>
        )}
      </DatePickerContext>
    </DatePickerView>
  )
}

export {
  DatePicker,
  DatePickerLabel,
  DatePickerControl,
  DatePickerInput,
  DatePickerTrigger,
  DatePickerClearTrigger,
  DatePickerPositioner,
  DatePickerContent,
  DatePickerView,
  DatePickerViewControl,
  DatePickerViewTrigger,
  DatePickerPrevTrigger,
  DatePickerNextTrigger,
  DatePickerRangeText,
  DatePickerValueText,
  DatePickerTable,
  DatePickerTableHead,
  DatePickerTableBody,
  DatePickerTableRow,
  DatePickerTableHeader,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerMonthSelect,
  DatePickerYearSelect,
  DatePickerPresetTrigger,
  DatePickerSelectHeader,
  DatePickerContext,
  DatePickerRootProvider,
  DatePickerDayView,
  DatePickerMonthView,
  DatePickerYearView,
}

export {
  useDatePicker,
  useDatePickerContext,
  type DatePickerValueChangeDetails,
  type DatePickerOpenChangeDetails,
} from "@ark-ui/react/date-picker"

export { CalendarDate, type DateValue } from "@internationalized/date"
