"use client"

import * as React from "react"
import { cn } from "@/examples/ark/lib/utils"
import { DatePicker as DatePickerPrimitive } from "@ark-ui/react/date-picker"
import { Portal } from "@ark-ui/react/portal"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

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
>(({ className, children, ...props }, ref) => (
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
))
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
          "z-50 flex flex-col gap-3 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg outline-none",
          "min-w-70",
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
    className={cn("flex items-center justify-between gap-2", className)}
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
      "inline-flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1.5 text-sm font-semibold transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/20 focus-visible:outline-none",
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
    data-slot="date-picker-prev-trigger"
    className={cn(
      "inline-flex size-8 items-center justify-center rounded-md border-transparent transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/20 focus-visible:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 [&_svg]:size-4",
      className
    )}
    {...props}
  >
    {children ?? <ChevronLeftIcon />}
  </DatePickerPrimitive.PrevTrigger>
))
DatePickerPrevTrigger.displayName = "DatePickerPrevTrigger"

const DatePickerNextTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof DatePickerPrimitive.NextTrigger>
>(({ className, children, ...props }, ref) => (
  <DatePickerPrimitive.NextTrigger
    ref={ref}
    data-slot="date-picker-next-trigger"
    className={cn(
      "inline-flex size-8 items-center justify-center rounded-md border-transparent transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/20 focus-visible:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 [&_svg]:size-4",
      className
    )}
    {...props}
  >
    {children ?? <ChevronRightIcon />}
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
    className={cn("w-full border-collapse border-spacing-0", className)}
    {...props}
  />
))
DatePickerTable.displayName = "DatePickerTable"

const DatePickerTableHead = DatePickerPrimitive.TableHead
const DatePickerTableBody = DatePickerPrimitive.TableBody
const DatePickerTableRow = DatePickerPrimitive.TableRow

const DatePickerTableHeader = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<typeof DatePickerPrimitive.TableHeader>
>(({ className, ...props }, ref) => (
  <DatePickerPrimitive.TableHeader
    ref={ref}
    data-slot="date-picker-table-header"
    className={cn(
      "py-2 text-center text-xs font-medium tracking-wide text-muted-foreground uppercase select-none",
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
    className={cn("p-0 text-center", className)}
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
      "inline-flex size-9 items-center justify-center rounded-md text-sm font-normal outline-none select-none",
      "hover:bg-accent hover:not-data-selected:not-data-in-range:text-accent-foreground",
      "focus-visible:relative focus-visible:z-[1] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary",
      "data-[today]:font-semibold data-[today]:text-primary",
      "data-[selected]:bg-primary data-[selected]:font-medium data-[selected]:text-primary-foreground",
      "data-[in-range]:rounded-none data-[in-range]:bg-accent data-[in-range]:text-accent-foreground",
      "data-[range-start]:rounded-none data-[range-start]:rounded-s-md data-[range-start]:bg-primary data-[range-start]:text-primary-foreground",
      "data-[range-end]:rounded-none data-[range-end]:rounded-e-md data-[range-end]:bg-primary data-[range-end]:text-primary-foreground",
      "data-[range-start][data-range-end]:rounded-md",
      "data-[outside-range]:text-muted-foreground data-[outside-range]:opacity-50",
      "data-[disabled]:cursor-not-allowed data-[disabled]:text-muted-foreground data-[disabled]:opacity-40",
      "data-[unavailable]:text-muted-foreground data-[unavailable]:line-through data-[unavailable]:opacity-40",
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

function DatePickerDayView({ className }: { className?: string }) {
  return (
    <DatePickerView view="day" className={cn("flex flex-col gap-3", className)}>
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
      className={cn("flex flex-col gap-3", className)}
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
                        <DatePickerTableCell key={j} value={month.value}>
                          <DatePickerTableCellTrigger>
                            {month.label}
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

function DatePickerYearView({ className }: { className?: string }) {
  return (
    <DatePickerView
      view="year"
      className={cn("flex flex-col gap-3", className)}
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
                      <DatePickerTableCell key={j} value={year.value}>
                        <DatePickerTableCellTrigger>
                          {year.label}
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
