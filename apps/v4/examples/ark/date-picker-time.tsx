"use client"

import { useState } from "react"
import {
  CalendarDateTime,
  getLocalTimeZone,
} from "@internationalized/date"
import {
  DatePicker,
  type DatePickerValueChangeDetails,
} from "@ark-ui/react/date-picker"
import { Portal } from "@ark-ui/react/portal"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
})

export function DatePickerTime() {
  const [value, setValue] = useState<CalendarDateTime[]>([])

  const timeValue = value[0]
    ? `${String(value[0].hour).padStart(2, "0")}:${String(value[0].minute).padStart(2, "0")}`
    : ""

  const onTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.currentTarget.value.split(":").map(Number)
    setValue((prev) => {
      const current = prev[0] ?? new CalendarDateTime(2025, 1, 1, 0, 0)
      return [current.set({ hour: hours, minute: minutes })]
    })
  }

  const onDateChange = (details: DatePickerValueChangeDetails) => {
    const newDate = details.value[0]
    if (!newDate) return setValue([])
    const prevTime = value[0] ?? { hour: 0, minute: 0 }
    setValue([
      new CalendarDateTime(
        newDate.year,
        newDate.month,
        newDate.day,
        prevTime.hour,
        prevTime.minute
      ),
    ])
  }

  return (
    <div className="mx-auto flex max-w-xs flex-row items-end gap-3">
      <DatePicker.Root
        value={value}
        onValueChange={onDateChange}
        closeOnSelect={false}
      >
        <div className="flex flex-col gap-1.5">
          <DatePicker.Label className="text-sm font-medium leading-none">
            Date
          </DatePicker.Label>
          <DatePicker.Control>
            <DatePicker.Trigger className="inline-flex h-9 w-32 items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&[data-placeholder]]:text-muted-foreground">
              <DatePicker.ValueText placeholder="Select date" />
              <ChevronDownIcon className="size-4 text-muted-foreground" />
            </DatePicker.Trigger>
          </DatePicker.Control>
        </div>
        <Portal>
          <DatePicker.Positioner className="z-50">
            <DatePicker.Content className="flex flex-col gap-3 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg outline-none origin-[var(--transform-origin)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[98%] data-[state=open]:zoom-in-[98%]">
              <DatePicker.View view="day">
                <DatePicker.Context>
                  {(api) => (
                    <>
                      <DatePicker.ViewControl className="flex items-center justify-between pb-1">
                        <DatePicker.PrevTrigger className="inline-flex size-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                          <ChevronLeftIcon className="size-4" />
                        </DatePicker.PrevTrigger>
                        <DatePicker.ViewTrigger className="flex-1 text-center text-sm font-medium hover:underline">
                          <DatePicker.RangeText />
                        </DatePicker.ViewTrigger>
                        <DatePicker.NextTrigger className="inline-flex size-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                          <ChevronRightIcon className="size-4" />
                        </DatePicker.NextTrigger>
                      </DatePicker.ViewControl>
                      <DatePicker.Table className="w-full border-collapse">
                        <DatePicker.TableHead>
                          <DatePicker.TableRow className="flex">
                            {api.weekDays.map((weekDay, i) => (
                              <DatePicker.TableHeader
                                key={i}
                                className="w-8 flex-1 pb-1 text-center text-xs font-normal text-muted-foreground"
                              >
                                {weekDay.short}
                              </DatePicker.TableHeader>
                            ))}
                          </DatePicker.TableRow>
                        </DatePicker.TableHead>
                        <DatePicker.TableBody>
                          {api.weeks.map((week, i) => (
                            <DatePicker.TableRow key={i} className="flex">
                              {week.map((day, j) => (
                                <DatePicker.TableCell
                                  key={j}
                                  value={day}
                                  className="flex-1 p-0 text-center"
                                >
                                  <DatePicker.TableCellTrigger className="inline-flex size-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[outside-range]:text-muted-foreground data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[today]:bg-accent data-[today]:text-accent-foreground data-[selected]:data-[today]:bg-primary data-[selected]:data-[today]:text-primary-foreground">
                                    {day.day}
                                  </DatePicker.TableCellTrigger>
                                </DatePicker.TableCell>
                              ))}
                            </DatePicker.TableRow>
                          ))}
                        </DatePicker.TableBody>
                      </DatePicker.Table>
                      <input
                        type="time"
                        value={timeValue}
                        onChange={onTimeChange}
                        className="mt-2 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                    </>
                  )}
                </DatePicker.Context>
              </DatePicker.View>
              <DatePicker.View view="month">
                <DatePicker.Context>
                  {(api) => (
                    <>
                      <DatePicker.ViewControl className="flex items-center justify-between pb-1">
                        <DatePicker.PrevTrigger className="inline-flex size-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                          <ChevronLeftIcon className="size-4" />
                        </DatePicker.PrevTrigger>
                        <DatePicker.ViewTrigger className="flex-1 text-center text-sm font-medium hover:underline">
                          <DatePicker.RangeText />
                        </DatePicker.ViewTrigger>
                        <DatePicker.NextTrigger className="inline-flex size-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                          <ChevronRightIcon className="size-4" />
                        </DatePicker.NextTrigger>
                      </DatePicker.ViewControl>
                      <DatePicker.Table className="w-full border-collapse">
                        <DatePicker.TableBody>
                          {api
                            .getMonthsGrid({ columns: 4, format: "short" })
                            .map((months, i) => (
                              <DatePicker.TableRow
                                key={i}
                                className="flex"
                              >
                                {months.map((month, j) => (
                                  <DatePicker.TableCell
                                    key={j}
                                    value={month.value}
                                    className="flex-1 p-0"
                                  >
                                    <DatePicker.TableCellTrigger className="inline-flex h-8 w-full items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground data-[selected]:bg-primary data-[selected]:text-primary-foreground">
                                      {month.label}
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
              <DatePicker.View view="year">
                <DatePicker.Context>
                  {(api) => (
                    <>
                      <DatePicker.ViewControl className="flex items-center justify-between pb-1">
                        <DatePicker.PrevTrigger className="inline-flex size-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                          <ChevronLeftIcon className="size-4" />
                        </DatePicker.PrevTrigger>
                        <DatePicker.ViewTrigger className="flex-1 text-center text-sm font-medium hover:underline">
                          <DatePicker.RangeText />
                        </DatePicker.ViewTrigger>
                        <DatePicker.NextTrigger className="inline-flex size-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                          <ChevronRightIcon className="size-4" />
                        </DatePicker.NextTrigger>
                      </DatePicker.ViewControl>
                      <DatePicker.Table className="w-full border-collapse">
                        <DatePicker.TableBody>
                          {api
                            .getYearsGrid({ columns: 4 })
                            .map((years, i) => (
                              <DatePicker.TableRow
                                key={i}
                                className="flex"
                              >
                                {years.map((year, j) => (
                                  <DatePicker.TableCell
                                    key={j}
                                    value={year.value}
                                    className="flex-1 p-0"
                                  >
                                    <DatePicker.TableCellTrigger className="inline-flex h-8 w-full items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground data-[selected]:bg-primary data-[selected]:text-primary-foreground">
                                      {year.label}
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
          </DatePicker.Positioner>
        </Portal>
      </DatePicker.Root>
      <div className="flex w-32 flex-col gap-1.5">
        <label
          htmlFor="time-picker-optional"
          className="text-sm font-medium leading-none"
        >
          Time
        </label>
        <input
          type="time"
          id="time-picker-optional"
          step="1"
          defaultValue="10:30:00"
          className="flex h-9 w-full appearance-none rounded-md border border-input bg-background px-3 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  )
}
