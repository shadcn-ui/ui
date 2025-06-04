"use client"

import * as React from "react"

import { Calendar } from "@/registry/new-york-v4/ui/calendar"
import { Card, CardContent, CardHeader } from "@/registry/new-york-v4/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"

export default function Calendar13() {
  const [dropdown, setDropdown] =
    React.useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
      "dropdown"
    )
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )

  return (
    <Card className="pt-4">
      <CardHeader className="gap-0 border-b !pb-4">
        <Select
          value={dropdown}
          onValueChange={(value) =>
            setDropdown(
              value as React.ComponentProps<typeof Calendar>["captionLayout"]
            )
          }
        >
          <SelectTrigger size="sm" className="w-full">
            <SelectValue placeholder="Dropdown" />
          </SelectTrigger>
          <SelectContent align="center">
            <SelectItem value="dropdown">Month and Year</SelectItem>
            <SelectItem value="dropdown-months">Month Only</SelectItem>
            <SelectItem value="dropdown-years">Year Only</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={setDate}
          captionLayout={dropdown}
          className="p-0"
        />
      </CardContent>
    </Card>
  )
}
