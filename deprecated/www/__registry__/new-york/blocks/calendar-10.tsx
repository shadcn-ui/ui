"use client"

import * as React from "react"

import { Button } from "@/registry/new-york/ui/button"
import { Calendar } from "@/registry/new-york/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card"

export default function Calendar10() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )
  const [month, setMonth] = React.useState<Date | undefined>(new Date())

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Appointment</CardTitle>
        <CardDescription>Find a date</CardDescription>
        <Button
          size="sm"
          variant="outline"
          className="absolute right-4 top-4"
          onClick={() => {
            setMonth(new Date())
            setDate(new Date())
          }}
        >
          Today
        </Button>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          month={month}
          onMonthChange={setMonth}
          selected={date}
          onSelect={setDate}
          className="bg-transparent p-0"
        />
      </CardContent>
    </Card>
  )
}
