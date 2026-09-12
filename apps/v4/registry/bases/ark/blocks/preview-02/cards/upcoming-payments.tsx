"use client"

import * as React from "react"

import { getLocalTimeZone, today } from "@internationalized/date"

import { Badge } from "@/registry/bases/ark/ui/badge"
import {
  Calendar,
  type DatePickerValueChangeDetails,
  type DateValue,
} from "@/registry/bases/ark/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/ark/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/ark/ui/item"

export function UpcomingPayments() {
  const [value, setValue] = React.useState<DateValue[]>([
    today(getLocalTimeZone()),
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Payments</CardTitle>
        <CardDescription>
          Select a date to view scheduled payments.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Item variant="outline" className="justify-center">
          <Calendar
            selectionMode="single"
            value={value}
            onValueChange={(details: DatePickerValueChangeDetails) =>
              setValue(details.value)
            }
            className="w-full [--cell-size:--spacing(8)] md:[--cell-size:--spacing(10)] style-sera:md:[--cell-size:--spacing(9)]"
          />
        </Item>
        <ItemGroup className="w-full">
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Netflix Subscription</ItemTitle>
              <ItemDescription>Apr 15, 2024</ItemDescription>
            </ItemContent>
            <Badge variant="secondary">$19.99</Badge>
          </Item>
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Rent Payment</ItemTitle>
              <ItemDescription>Apr 1, 2024</ItemDescription>
            </ItemContent>
            <Badge variant="secondary">$2,400.00</Badge>
          </Item>
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Auto Insurance</ItemTitle>
              <ItemDescription>Apr 22, 2024</ItemDescription>
            </ItemContent>
            <Badge variant="secondary">$186.00</Badge>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
