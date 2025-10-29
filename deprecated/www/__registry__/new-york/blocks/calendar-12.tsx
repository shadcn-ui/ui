"use client"

import * as React from "react"
import { type DateRange } from "react-day-picker"
import { enUS, es } from "react-day-picker/locale"

import { Calendar } from "@/registry/new-york/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select"

const localizedStrings = {
  en: {
    title: "Book an appointment",
    description: "Select the dates for your appointment",
  },
  es: {
    title: "Reserva una cita",
    description: "Selecciona las fechas para tu cita",
  },
} as const

export default function Calendar12() {
  const [locale, setLocale] =
    React.useState<keyof typeof localizedStrings>("es")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 8, 9),
    to: new Date(2025, 8, 17),
  })

  return (
    <Card>
      <CardHeader className="relative border-b">
        <CardTitle>{localizedStrings[locale].title}</CardTitle>
        <CardDescription>
          {localizedStrings[locale].description}
        </CardDescription>
        <Select
          value={locale}
          onValueChange={(value) =>
            setLocale(value as keyof typeof localizedStrings)
          }
        >
          <SelectTrigger className="absolute right-4 top-4 w-[100px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-4">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          defaultMonth={dateRange?.from}
          numberOfMonths={2}
          locale={locale === "es" ? es : enUS}
          className="bg-transparent p-0"
          buttonVariant="outline"
        />
      </CardContent>
    </Card>
  )
}
