"use client"

import * as React from "react"
import { addDays } from "date-fns"

import { Button } from "@/registry/new-york-v4/ui/button"
import { Calendar } from "@/registry/new-york-v4/ui/calendar"
import { Card, CardContent, CardFooter } from "@/registry/new-york-v4/ui/card"

export default function Calendar19() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )

  return (
    <Card className="max-w-[300px] py-4">
      <CardContent className="px-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={date}
          className="bg-transparent p-0 [--cell-size:--spacing(9.5)]"
        />
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t px-4 !pt-4">
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
            onClick={() => {
              const newDate = addDays(new Date(), preset.value)
              setDate(newDate)
            }}
          >
            {preset.label}
          </Button>
        ))}
      </CardFooter>
    </Card>
  )
}
