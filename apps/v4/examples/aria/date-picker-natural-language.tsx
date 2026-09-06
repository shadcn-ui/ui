"use client"

import * as React from "react"
import {
  fromDate,
  getLocalTimeZone,
  toCalendarDate,
  type CalendarDate,
} from "@internationalized/date"
import { parseDate as parseNaturalLanguage } from "chrono-node"
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

function parseDate(value: string) {
  const date = parseNaturalLanguage(value)
  return date ? toCalendarDate(fromDate(date, getLocalTimeZone())) : undefined
}

function formatDate(calendarDate: CalendarDate | undefined) {
  if (!calendarDate) {
    return ""
  }

  const date = calendarDate?.toDate(getLocalTimeZone())
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export function DatePickerNaturalLanguage() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("In 2 days")
  const [date, setDate] = React.useState<CalendarDate | undefined>(() =>
    parseDate(value)
  )

  return (
    <Field className="mx-auto max-w-xs">
      <FieldLabel htmlFor="date-optional">Schedule Date</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="date-optional"
          value={value}
          placeholder="Tomorrow or next week"
          onChange={(e) => {
            setValue(e.target.value)
            const date = parseDate(e.target.value)
            if (date) {
              setDate(date)
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
              offset={8}
            >
              <Calendar
                value={date}
                captionLayout="dropdown"
                onChange={(date) => {
                  setDate(date)
                  setValue(formatDate(date))
                  setOpen(false)
                }}
              />
            </Popover>
          </PopoverTrigger>
        </InputGroupAddon>
      </InputGroup>
      <div className="px-1 text-sm text-muted-foreground">
        Your post will be published on{" "}
        <span className="font-medium">{formatDate(date)}</span>.
      </div>
    </Field>
  )
}
