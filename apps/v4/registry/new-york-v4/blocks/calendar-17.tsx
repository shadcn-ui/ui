"use client"

import * as React from "react"

import { Calendar } from "@/registry/new-york-v4/ui/calendar"
import { Card, CardContent, CardFooter } from "@/registry/new-york-v4/ui/card"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"

export default function Calendar17() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )

  return (
    <Card className="w-fit py-4">
      <CardContent className="px-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="bg-transparent p-0 [--cell-size:--spacing(10.5)]"
        />
      </CardContent>
      <CardFooter className="flex gap-2 border-t px-4 !pt-4 *:[div]:w-full">
        <div>
          <Label htmlFor="time-from" className="sr-only">
            Start Time
          </Label>
          <Input
            id="time-from"
            type="time"
            step="1"
            defaultValue="10:30:00"
            className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
        <span>-</span>
        <div>
          <Label htmlFor="time-to" className="sr-only">
            End Time
          </Label>
          <Input
            id="time-to"
            type="time"
            step="1"
            defaultValue="12:30:00"
            className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
      </CardFooter>
    </Card>
  )
}
