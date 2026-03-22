"use client"

import { DatePicker } from "@ark-ui/react/date-picker"
import { Portal } from "@ark-ui/react/portal"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

export function DatePickerSimple() {
  return (
    <DatePicker.Root className="mx-auto w-44">
      <DatePicker.Label className="text-sm font-medium leading-none">
        Date
      </DatePicker.Label>
      <DatePicker.Control>
        <DatePicker.Trigger className="mt-1.5 inline-flex h-9 w-full items-center justify-start rounded-md border border-input bg-background px-3 text-sm shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&[data-placeholder]]:text-muted-foreground">
          <DatePicker.ValueText placeholder="Pick a date" />
        </DatePicker.Trigger>
      </DatePicker.Control>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content className="rounded-lg border bg-popover p-3 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
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
  )
}
