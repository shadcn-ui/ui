"use client"

import { Button } from "@/examples/ark/ui/button"
import {
  DatePicker,
  DatePickerContent,
  DatePickerContext,
  DatePickerControl,
  DatePickerMonthView,
  DatePickerNextTrigger,
  DatePickerPrevTrigger,
  DatePickerTable,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerTableHead,
  DatePickerTableHeader,
  DatePickerTableRow,
  DatePickerTrigger,
  DatePickerValueText,
  DatePickerView,
  DatePickerYearView,
} from "@/examples/ark/ui/date-picker"
import { CalendarIcon } from "lucide-react"

export function DatePickerWithRange() {
  return (
    <DatePicker selectionMode="range" numOfMonths={2} closeOnSelect>
      <DatePickerControl>
        <DatePickerTrigger asChild>
          <Button
            variant="outline"
            className="w-auto min-w-[280px] justify-start px-2.5 font-normal"
          >
            <CalendarIcon className="size-4 text-muted-foreground" />
            <DatePickerValueText placeholder="Pick a date range" />
          </Button>
        </DatePickerTrigger>
      </DatePickerControl>
      <DatePickerContent>
        <DatePickerView view="day" className="flex flex-col gap-4">
          <DatePickerContext>
            {(api) => {
              const offset = api.getOffset({ months: 1 })
              return (
                <div className="flex flex-col gap-4 md:flex-row">
                  {/* First month */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <DatePickerPrevTrigger />
                      <span className="text-sm font-medium">
                        {api.visibleRangeText.start}
                      </span>
                      <div className="size-(--cell-size)" />
                    </div>
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
                  </div>
                  {/* Second month */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="size-(--cell-size)" />
                      <span className="text-sm font-medium">
                        {api.visibleRangeText.end}
                      </span>
                      <DatePickerNextTrigger />
                    </div>
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
                        {offset.weeks.map((week, i) => (
                          <DatePickerTableRow key={i}>
                            {week.map((day, j) => (
                              <DatePickerTableCell
                                key={j}
                                value={day}
                                visibleRange={offset.visibleRange}
                              >
                                <DatePickerTableCellTrigger>
                                  {day.day}
                                </DatePickerTableCellTrigger>
                              </DatePickerTableCell>
                            ))}
                          </DatePickerTableRow>
                        ))}
                      </DatePickerTableBody>
                    </DatePickerTable>
                  </div>
                </div>
              )
            }}
          </DatePickerContext>
        </DatePickerView>
        <DatePickerMonthView />
        <DatePickerYearView />
      </DatePickerContent>
    </DatePicker>
  )
}
