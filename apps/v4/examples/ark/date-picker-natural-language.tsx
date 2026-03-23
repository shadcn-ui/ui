"use client"

import { useState } from "react"
import { DatePicker } from "@ark-ui/react/date-picker"
import { Portal } from "@ark-ui/react/portal"
import { parseDate } from "chrono-node"
import { CalendarDate } from "@internationalized/date"
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export function DatePickerNaturalLanguage() {
  const initialDate = parseDate("In 2 days")
  const [inputValue, setInputValue] = useState("In 2 days")
  const [resolvedDate, setResolvedDate] = useState<Date | undefined>(
    initialDate || undefined
  )
  const [pickerValue, setPickerValue] = useState<CalendarDate[]>(
    initialDate
      ? [
          new CalendarDate(
            initialDate.getFullYear(),
            initialDate.getMonth() + 1,
            initialDate.getDate()
          ),
        ]
      : []
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setInputValue(text)
    const parsed = parseDate(text)
    if (parsed) {
      setResolvedDate(parsed)
      setPickerValue([
        new CalendarDate(
          parsed.getFullYear(),
          parsed.getMonth() + 1,
          parsed.getDate()
        ),
      ])
    }
  }

  return (
    <div className="mx-auto flex max-w-xs flex-col gap-1.5">
      <DatePicker.Root
        value={pickerValue}
        onValueChange={(details) => {
          setPickerValue(details.value)
          const d = details.value[0]
          if (d) {
            const jsDate = new Date(d.year, d.month - 1, d.day)
            setResolvedDate(jsDate)
            setInputValue(formatDate(jsDate))
          }
        }}
      >
        <DatePicker.Label className="text-sm font-medium leading-none">
          Schedule Date
        </DatePicker.Label>
        <div className="relative mt-1.5">
          <input
            value={inputValue}
            placeholder="Tomorrow or next week"
            onChange={handleInputChange}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 pr-9 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <DatePicker.Trigger className="absolute inset-y-0 right-0 flex items-center justify-center px-2 text-muted-foreground hover:text-foreground">
            <CalendarIcon className="size-4" />
          </DatePicker.Trigger>
        </div>
        <Portal>
          <DatePicker.Positioner>
            <DatePicker.Content className="z-50 flex flex-col gap-3 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg outline-none origin-[var(--transform-origin)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[98%] data-[state=open]:zoom-in-[98%]">
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
      <div className="px-1 text-sm text-muted-foreground">
        Your post will be published on{" "}
        <span className="font-medium">{formatDate(resolvedDate)}</span>.
      </div>
    </div>
  )
}
