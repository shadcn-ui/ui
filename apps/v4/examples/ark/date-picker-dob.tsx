"use client"

import { DatePicker } from "@ark-ui/react/date-picker"
import { Portal } from "@ark-ui/react/portal"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

export function DatePickerSimple() {
  return (
    <DatePicker.Root className="mx-auto w-44" closeOnSelect>
      <DatePicker.Label className="text-sm font-medium leading-none">
        Date of birth
      </DatePicker.Label>
      <DatePicker.Control>
        <DatePicker.Trigger className="mt-1.5 inline-flex h-9 w-full items-center justify-start rounded-md border border-input bg-background px-3 text-sm shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&[data-placeholder]]:text-muted-foreground">
          <DatePicker.ValueText placeholder="Select date" />
        </DatePicker.Trigger>
      </DatePicker.Control>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content className="z-50 flex flex-col gap-3 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg outline-none origin-[var(--transform-origin)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[98%] data-[state=open]:zoom-in-[98%]">
            <DatePicker.View view="day">
              <DatePicker.Context>
                {(api) => (
                  <>
                    <DatePicker.ViewControl className="flex items-center justify-between gap-2 pb-1">
                      <div className="flex items-center gap-1">
                        <DatePicker.MonthSelect className="h-7 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
                        <DatePicker.YearSelect className="h-7 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
                      </div>
                      <div className="flex items-center gap-1">
                        <DatePicker.PrevTrigger className="inline-flex size-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                          <ChevronLeftIcon className="size-4" />
                        </DatePicker.PrevTrigger>
                        <DatePicker.NextTrigger className="inline-flex size-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                          <ChevronRightIcon className="size-4" />
                        </DatePicker.NextTrigger>
                      </div>
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
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  )
}
