"use client"

import {
  DatePicker,
  DatePickerControl,
  DatePickerInput,
  DatePickerTrigger,
  DatePickerContent,
  DatePickerView,
  DatePickerContext,
  DatePickerViewControl,
  DatePickerPrevTrigger,
  DatePickerNextTrigger,
  DatePickerMonthSelect,
  DatePickerYearSelect,
  DatePickerTable,
  DatePickerTableHead,
  DatePickerTableBody,
  DatePickerTableRow,
  DatePickerTableHeader,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
} from "@/examples/ark/ui/date-picker"

export function DatePickerSimple() {
  return (
    <DatePicker closeOnSelect>
      <DatePickerControl>
        <DatePickerInput placeholder="Date of birth" />
        <DatePickerTrigger />
      </DatePickerControl>
      <DatePickerContent>
        <DatePickerView view="day" className="flex flex-col gap-3">
          <DatePickerContext>
            {(api) => (
              <>
                <DatePickerViewControl>
                  <div className="flex items-center gap-1">
                    <DatePickerMonthSelect className="h-7 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
                    <DatePickerYearSelect className="h-7 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                  <div className="flex items-center gap-1">
                    <DatePickerPrevTrigger />
                    <DatePickerNextTrigger />
                  </div>
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
      </DatePickerContent>
    </DatePicker>
  )
}
