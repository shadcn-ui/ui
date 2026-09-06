"use client"

import * as React from "react"
import {
  fromDate,
  getLocalTimeZone,
  parseDate,
  toCalendarDate,
  type CalendarDate,
} from "@internationalized/date"
import { CalendarIcon } from "lucide-react"

import { Calendar } from "@/styles/aria-nova/ui/calendar"
import { Field, FieldLabel } from "@/styles/aria-nova/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/styles/aria-nova/ui/input-group"
import { Popover, PopoverTrigger } from "@/styles/aria-nova/ui/popover"

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

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

export function DatePickerInput() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<CalendarDate | undefined>(
    parseDate("2025-06-01")
  )
  const [month, setMonth] = React.useState<CalendarDate>(date!)
  const [value, setValue] = React.useState(
    formatDate(date?.toDate(getLocalTimeZone()))
  )

  return (
    <Field className="mx-auto w-48">
      <FieldLabel htmlFor="date-required">Subscription Date</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="date-required"
          value={value}
          placeholder="June 01, 2025"
          onChange={(e) => {
            const date = new Date(e.target.value)
            setValue(e.target.value)
            if (isValidDate(date)) {
              setDate(toCalendarDate(fromDate(date, getLocalTimeZone())))
              setMonth(toCalendarDate(fromDate(date, getLocalTimeZone())))
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <PopoverTrigger isOpen={open} onOpenChange={setOpen}>
            <InputGroupButton
              id="date-picker"
              variant="ghost"
              size="icon-xs"
              aria-label="Select date"
            >
              <CalendarIcon />
              <span className="sr-only">Select date</span>
            </InputGroupButton>
            <Popover
              className="w-auto overflow-hidden p-0"
              placement="bottom end"
              crossOffset={-8}
              offset={10}
            >
              <Calendar
                value={date}
                focusedValue={month}
                onFocusChange={setMonth}
                onChange={(date) => {
                  setDate(date)
                  setValue(formatDate(date?.toDate(getLocalTimeZone())))
                  setOpen(false)
                }}
              />
            </Popover>
          </PopoverTrigger>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
