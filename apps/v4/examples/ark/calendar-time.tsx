"use client"

import * as React from "react"
import {
  Calendar,
  CalendarDate,
  type DatePickerValueChangeDetails,
  type DateValue,
} from "@/styles/ark-nova/ui/calendar"
import { Card, CardContent, CardFooter } from "@/styles/ark-nova/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/styles/ark-nova/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/styles/ark-nova/ui/input-group"
import { Clock2Icon } from "lucide-react"

export function CalendarWithTime() {
  const now = new Date()
  const [value, setValue] = React.useState<DateValue[]>([
    new CalendarDate(now.getFullYear(), now.getMonth() + 1, 12),
  ])

  return (
    <Card size="sm" className="mx-auto w-fit">
      <CardContent>
        <Calendar
          selectionMode="single"
          value={value}
          onValueChange={(details: DatePickerValueChangeDetails) =>
            setValue(details.value)
          }
          className="p-0"
        />
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
                <Clock2Icon className="text-muted-foreground" />
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
                <Clock2Icon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </CardFooter>
    </Card>
  )
}
