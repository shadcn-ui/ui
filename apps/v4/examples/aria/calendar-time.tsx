"use client"

import * as React from "react"
import { CalendarDate } from "@internationalized/date"
import { Clock2Icon } from "lucide-react"

import { Calendar } from "@/styles/aria-nova/ui/calendar"
import { Card, CardContent, CardFooter } from "@/styles/aria-nova/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/styles/aria-nova/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/styles/aria-nova/ui/input-group"

export function CalendarWithTime() {
  const [date, setDate] = React.useState<CalendarDate | undefined>(
    new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, 12)
  )

  return (
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
