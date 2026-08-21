"use client"

import { CalendarDate, isWeekend } from "@internationalized/date"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/ark/components/example"
import { Button } from "@/registry/bases/ark/ui/button"
import {
  Calendar,
  CalendarDayView,
  CalendarMonthView,
  CalendarYearView,
  CalendarSelectHeader,
  CalendarPresetTrigger,
} from "@/registry/bases/ark/ui/calendar"
import { Card, CardContent, CardFooter } from "@/registry/bases/ark/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/registry/bases/ark/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/bases/ark/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/ark/ui/popover"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function CalendarExample() {
  return (
    <ExampleWrapper>
      <CalendarSingle />
      <CalendarMultiple />
      <CalendarRange />
      <CalendarWithViews />
      <CalendarWithTime />
      <CalendarCustomDays />
      <CalendarWithPresets />
      <CalendarInCard />
      <CalendarInPopover />
    </ExampleWrapper>
  )
}

function CalendarSingle() {
  return (
    <Example title="Single">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar
            defaultValue={[
              new CalendarDate(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                12
              ),
            ]}
          >
            <CalendarDayView header={<CalendarSelectHeader />} />
          </Calendar>
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
          <Calendar selectionMode="multiple">
            <CalendarDayView header={<CalendarSelectHeader />} />
          </Calendar>
        </CardContent>
      </Card>
    </Example>
  )
}

function CalendarRange() {
  return (
    <Example
      title="Range"
      containerClassName="lg:col-span-full 2xl:col-span-full"
      className="p-12"
    >
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar
            selectionMode="range"
            numOfMonths={2}
            defaultValue={[
              new CalendarDate(new Date().getFullYear(), 1, 12),
              new CalendarDate(new Date().getFullYear(), 2, 11),
            ]}
          >
            <CalendarDayView header={<CalendarSelectHeader />} />
          </Calendar>
        </CardContent>
      </Card>
    </Example>
  )
}

function CalendarWithViews() {
  return (
    <Example title="With Views">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar
            defaultValue={[
              new CalendarDate(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                12
              ),
            ]}
          >
            <CalendarDayView />
            <CalendarMonthView />
            <CalendarYearView />
          </Calendar>
        </CardContent>
      </Card>
    </Example>
  )
}

function CalendarWithTime() {
  return (
    <Example title="With Time">
      <Card size="sm" className="mx-auto w-fit">
        <CardContent>
          <Calendar
            defaultValue={[
              new CalendarDate(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                12
              ),
            ]}
            className="p-0"
          >
            <CalendarDayView header={<CalendarSelectHeader />} />
          </Calendar>
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
  return (
    <Example title="Custom Days">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar
            selectionMode="range"
            defaultFocusedValue={
              new CalendarDate(new Date().getFullYear(), 12, 8)
            }
            defaultValue={[
              new CalendarDate(new Date().getFullYear(), 12, 8),
              new CalendarDate(new Date().getFullYear(), 12, 18),
            ]}
            className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
          >
            <CalendarDayView
              cell={(day) => (
                <>
                  {day.day}
                  <span className="text-[0.6rem] text-muted-foreground">
                    {isWeekend(day, "en-US") ? "$120" : "$100"}
                  </span>
                </>
              )}
            />
          </Calendar>
        </CardContent>
      </Card>
    </Example>
  )
}

function CalendarWithPresets() {
  function daysFromNow(days: number) {
    const d = new Date()
    d.setDate(d.getDate() + days)
    return [
      new CalendarDate(
        d.getFullYear(),
        d.getMonth() + 1,
        d.getDate()
      ),
    ]
  }

  return (
    <Example title="With Presets">
      <Calendar className="p-0 [--cell-size:--spacing(9.5)]">
        <Card className="mx-auto w-fit max-w-[300px]" size="sm">
          <CardContent className="px-4">
            <CalendarDayView />
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 border-t">
            {[
              { label: "Today", value: daysFromNow(0) },
              { label: "Tomorrow", value: daysFromNow(1) },
              { label: "In 3 days", value: daysFromNow(3) },
              { label: "In a week", value: daysFromNow(7) },
              { label: "In 2 weeks", value: daysFromNow(14) },
            ].map((preset) => (
              <CalendarPresetTrigger
                key={preset.label}
                value={preset.value}
                asChild
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  {preset.label}
                </Button>
              </CalendarPresetTrigger>
            ))}
          </CardFooter>
        </Card>
      </Calendar>
    </Example>
  )
}

function CalendarInCard() {
  return (
    <Example title="In Card">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar>
            <CalendarDayView header={<CalendarSelectHeader />} />
          </Calendar>
        </CardContent>
      </Card>
    </Example>
  )
}

function CalendarInPopover() {
  return (
    <Example title="In Popover">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="px-2.5 font-normal">
            <IconPlaceholder
              lucide="CalendarIcon"
              tabler="IconCalendar"
              hugeicons="Calendar03Icon"
              phosphor="CalendarIcon"
              remixicon="RiCalendarLine"
              data-icon="inline-start"
            />
            Open Calendar
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar>
            <CalendarDayView header={<CalendarSelectHeader />} />
          </Calendar>
        </PopoverContent>
      </Popover>
    </Example>
  )
}
