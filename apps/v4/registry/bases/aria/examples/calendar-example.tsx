"use client"

import * as React from "react"
import {
  CalendarDate,
  getLocalTimeZone,
  isSameDay,
  isWeekend,
  today,
} from "@internationalized/date"
import { I18nProvider, useLocale, type DateRange } from "react-aria-components"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/aria/components/example"
import { Button } from "@/registry/bases/aria/ui/button"
import { Calendar, RangeCalendar } from "@/registry/bases/aria/ui/calendar"
import { Card, CardContent, CardFooter } from "@/registry/bases/aria/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/registry/bases/aria/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/bases/aria/ui/input-group"
import { Popover, PopoverTrigger } from "@/registry/bases/aria/ui/popover"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function CalendarExample() {
  return (
    <ExampleWrapper>
      <CalendarSingle />
      <CalendarMultiple />
      <CalendarBookedDates />
      <CalendarRange />
      <CalendarRangeMultipleMonths />
      <CalendarWithTime />
      <CalendarWithPresets />
      <CalendarCustomDays />
      <DatePickerSimple />
      <DataPickerWithDropdowns />
      <DatePickerWithRange />
      <CalendarInCard />
      <CalendarInPopover />
    </ExampleWrapper>
  )
}

function CalendarInCard() {
  return (
    <Example title="In Card">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar />
        </CardContent>
      </Card>
    </Example>
  )
}

function CalendarInPopover() {
  return (
    <Example title="In Popover">
      <PopoverTrigger>
        <Button variant="outline" className="px-2.5 font-normal">
          <IconPlaceholder
            lucide="CalendarIcon"
            tabler="IconCalendar"
            hugeicons="CalendarIcon"
            phosphor="CalendarBlankIcon"
            remixicon="RiCalendarLine"
            data-icon="inline-start"
          />
          Open Calendar
        </Button>
        <Popover className="w-auto p-0" placement="bottom start">
          <Calendar />
        </Popover>
      </PopoverTrigger>
    </Example>
  )
}

function CalendarSingle() {
  const [date, setDate] = React.useState<CalendarDate | undefined>(
    new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, 12)
  )
  return (
    <Example title="Single">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar value={date} onChange={setDate} captionLayout="dropdown" />
        </CardContent>
      </Card>
    </Example>
  )
}

function CalendarMultiple() {
  return (
    <Example title="Multiple">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar selectionMode="multiple" />
        </CardContent>
      </Card>
    </Example>
  )
}

function CalendarRange() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    start: new CalendarDate(new Date().getFullYear(), 1, 12),
    end: new CalendarDate(new Date().getFullYear(), 1, 12).add({ days: 30 }),
  })

  return (
    <Example
      title="Range"
      containerClassName="lg:col-span-full 2xl:col-span-full"
      className="p-12"
    >
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <RangeCalendar
            value={dateRange}
            onChange={setDateRange}
            numberOfMonths={2}
            maxValue={today(getLocalTimeZone())}
          />
        </CardContent>
      </Card>
    </Example>
  )
}

function CalendarRangeMultipleMonths() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    start: new CalendarDate(new Date().getFullYear(), 4, 12),
    end: new CalendarDate(new Date().getFullYear(), 4, 12).add({ days: 60 }),
  })

  return (
    <Example
      title="Range Multiple Months"
      containerClassName="lg:col-span-full 2xl:col-span-full"
      className="p-12"
    >
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <I18nProvider locale="es">
            <RangeCalendar
              value={range}
              onChange={setRange}
              numberOfMonths={3}
              weeksInMonth={6}
            />
          </I18nProvider>
        </CardContent>
      </Card>
    </Example>
  )
}

function CalendarBookedDates() {
  const [date, setDate] = React.useState<CalendarDate | undefined>(
    new CalendarDate(new Date().getFullYear(), 2, 3)
  )
  const bookedDates = Array.from(
    { length: 15 },
    (_, i) => new CalendarDate(new Date().getFullYear(), 2, 12 + i)
  )

  return (
    <Example title="Booked Dates">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar
            value={date}
            onChange={setDate}
            isDateUnavailable={(date) =>
              bookedDates.some((d) => isSameDay(date, d))
            }
          />
        </CardContent>
      </Card>
    </Example>
  )
}

function CalendarWithTime() {
  const [date, setDate] = React.useState<CalendarDate | undefined>(
    new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, 12)
  )

  return (
    <Example title="With Time">
      <Card size="sm" className="mx-auto w-fit">
        <CardContent>
          <Calendar value={date} onChange={setDate} className="p-0" />
        </CardContent>
        <CardFooter className="border-t bg-card">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="time-from">Start Time</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="time-from"
                  type="time"
                  step="1"
                  defaultValue="10:30:00"
                  className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
                <InputGroupAddon>
                  <IconPlaceholder
                    lucide="Clock2Icon"
                    tabler="IconClockHour2"
                    hugeicons="Clock03Icon"
                    phosphor="ClockIcon"
                    remixicon="RiTimeLine"
                    className="text-muted-foreground"
                  />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="time-to">End Time</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="time-to"
                  type="time"
                  step="1"
                  defaultValue="12:30:00"
                  className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
                <InputGroupAddon>
                  <IconPlaceholder
                    lucide="Clock2Icon"
                    tabler="IconClockHour2"
                    hugeicons="Clock03Icon"
                    phosphor="ClockIcon"
                    remixicon="RiTimeLine"
                    className="text-muted-foreground"
                  />
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>
        </CardFooter>
      </Card>
    </Example>
  )
}

function CalendarCustomDays() {
  const { locale } = useLocale()
  const [range, setRange] = React.useState<DateRange | undefined>({
    start: new CalendarDate(new Date().getFullYear(), 12, 8),
    end: new CalendarDate(new Date().getFullYear(), 12, 8).add({ days: 10 }),
  })

  return (
    <Example title="Custom Days">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <RangeCalendar
            value={range}
            onChange={setRange}
            numberOfMonths={1}
            captionLayout="dropdown"
            className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
            headerFormat={{ month: "long" }}
            renderCell={({ isOutsideMonth, date, defaultChildren }) => (
              <>
                {defaultChildren}
                {!isOutsideMonth && (
                  <span>{isWeekend(date, locale) ? "$120" : "$100"}</span>
                )}
              </>
            )}
          />
        </CardContent>
      </Card>
    </Example>
  )
}

function CalendarWithPresets() {
  const [date, setDate] = React.useState<CalendarDate | undefined>(
    new CalendarDate(new Date().getFullYear(), 2, 12)
  )
  const [currentMonth, setCurrentMonth] = React.useState<CalendarDate>(
    new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, 1)
  )

  return (
    <Example title="With Presets">
      <Card className="mx-auto w-fit max-w-[300px]" size="sm">
        <CardContent>
          <Calendar
            value={date}
            onChange={setDate}
            focusedValue={currentMonth}
            onFocusChange={setCurrentMonth}
            weeksInMonth={6}
            className="p-0 [--cell-size:--spacing(9.5)]"
          />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t">
          {[
            { label: "Today", value: 0 },
            { label: "Tomorrow", value: 1 },
            { label: "In 3 days", value: 3 },
            { label: "In a week", value: 7 },
            { label: "In 2 weeks", value: 14 },
          ].map((preset) => (
            <Button
              key={preset.value}
              variant="outline"
              size="sm"
              className="flex-1"
              onPress={() => {
                const newDate = today(getLocalTimeZone()).add({
                  days: preset.value,
                })
                setDate(newDate)
                setCurrentMonth(newDate)
              }}
            >
              {preset.label}
            </Button>
          ))}
        </CardFooter>
      </Card>
    </Example>
  )
}

function DatePickerSimple() {
  const [date, setDate] = React.useState<CalendarDate>()

  return (
    <Example title="Date Picker Simple">
      <Field className="mx-auto w-72">
        <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
        <PopoverTrigger>
          <Button
            variant="outline"
            id="date-picker-simple"
            className="justify-start px-2.5 font-normal"
          >
            <IconPlaceholder
              lucide="CalendarIcon"
              tabler="IconCalendar"
              hugeicons="CalendarIcon"
              phosphor="CalendarBlankIcon"
              remixicon="RiCalendarLine"
              data-icon="inline-start"
            />
            {date ? (
              date
                .toDate(getLocalTimeZone())
                .toLocaleDateString(undefined, { dateStyle: "long" })
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
          <Popover className="w-auto p-0" placement="bottom start">
            <Calendar value={date} onChange={setDate} />
          </Popover>
        </PopoverTrigger>
      </Field>
    </Example>
  )
}

function DatePickerWithRange() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    start: new CalendarDate(new Date().getFullYear(), 1, 20),
    end: new CalendarDate(new Date().getFullYear(), 1, 20).add({ days: 20 }),
  })

  return (
    <Example title="Date Picker Range">
      <Field className="mx-auto w-72">
        <FieldLabel htmlFor="date-picker-range">Date Picker Range</FieldLabel>
        <PopoverTrigger>
          <Button
            variant="outline"
            id="date-picker-range"
            className="justify-start px-2.5 font-normal"
          >
            <IconPlaceholder
              lucide="CalendarIcon"
              tabler="IconCalendar"
              hugeicons="CalendarIcon"
              phosphor="CalendarBlankIcon"
              remixicon="RiCalendarLine"
              data-icon="inline-start"
            />
            {date?.start && date.end ? (
              new Intl.DateTimeFormat(undefined, {
                dateStyle: "long",
              }).formatRange(
                date.start.toDate(getLocalTimeZone()),
                date.end.toDate(getLocalTimeZone())
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
          <Popover className="w-auto p-0" placement="bottom start">
            <RangeCalendar value={date} onChange={setDate} numberOfMonths={2} />
          </Popover>
        </PopoverTrigger>
      </Field>
    </Example>
  )
}

function DataPickerWithDropdowns() {
  const [date, setDate] = React.useState<CalendarDate>()
  const [open, setOpen] = React.useState(false)

  return (
    <Example title="Date Picker with Dropdowns">
      <Field className="mx-auto w-72">
        <FieldLabel htmlFor="date-picker-with-dropdowns-desktop">
          Date
        </FieldLabel>
        <PopoverTrigger isOpen={open} onOpenChange={setOpen}>
          <Button
            variant="outline"
            id="date-picker-with-dropdowns-desktop"
            className="justify-start px-2.5 font-normal"
          >
            {date ? (
              date
                .toDate(getLocalTimeZone())
                .toLocaleDateString(undefined, { dateStyle: "long" })
            ) : (
              <span>Pick a date</span>
            )}
            <IconPlaceholder
              lucide="ChevronDownIcon"
              tabler="IconChevronDown"
              hugeicons="ArrowDownIcon"
              phosphor="CaretDownIcon"
              remixicon="RiArrowDownSLine"
              data-icon="inline-start"
              className="ml-auto"
            />
          </Button>
          <Popover className="w-auto p-0" placement="bottom start">
            <Calendar
              value={date}
              onChange={setDate}
              captionLayout="dropdown"
            />
            <div className="flex gap-2 border-t p-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onPress={() => setOpen(false)}
              >
                Done
              </Button>
            </div>
          </Popover>
        </PopoverTrigger>
      </Field>
    </Example>
  )
}
