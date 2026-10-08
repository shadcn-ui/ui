"use client"

import * as React from "react"

import { Button } from "@/registry/bases/base/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import { Checkbox } from "@/registry/bases/base/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/registry/bases/base/ui/field"

const NOTIFICATIONS = [
  {
    id: "transactions",
    label: "Transaction alerts",
    description: "Deposits, withdrawals, and transfers.",
    defaultChecked: true,
  },
  {
    id: "security",
    label: "Security alerts",
    description: "Login attempts and account changes.",
    defaultChecked: true,
  },
  {
    id: "goals",
    label: "Goal milestones",
    description: "Updates at 25%, 50%, 75%, and 100%.",
    defaultChecked: false,
  },
  {
    id: "market",
    label: "Market updates",
    description: "Daily portfolio summary and price alerts.",
    defaultChecked: false,
  },
]

export function NotificationSettings() {
  const [checked, setChecked] = React.useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATIONS.map((n) => [n.id, n.defaultChecked]))
  )

  const allChecked = NOTIFICATIONS.every((n) => checked[n.id])
  const someChecked = NOTIFICATIONS.some((n) => checked[n.id]) && !allChecked

  const handleSelectAll = (value: boolean) => {
    setChecked(Object.fromEntries(NOTIFICATIONS.map((n) => [n.id, value])))
  }

  const handleToggle = (id: string, value: boolean) => {
    setChecked((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose what you want to be notified about.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field orientation="horizontal">
            <Checkbox
              id="notify-all"
              checked={allChecked}
              indeterminate={someChecked}
              onCheckedChange={(v) => handleSelectAll(!!v)}
            />
            <FieldContent>
              <FieldLabel htmlFor="notify-all">Select all</FieldLabel>
            </FieldContent>
          </Field>
          {NOTIFICATIONS.map((n) => (
            <Field key={n.id} orientation="horizontal">
              <Checkbox
                id={`notify-${n.id}`}
                checked={checked[n.id]}
                onCheckedChange={(v) => handleToggle(n.id, !!v)}
              />
              <FieldContent>
                <FieldLabel htmlFor={`notify-${n.id}`}>{n.label}</FieldLabel>
                <FieldDescription>{n.description}</FieldDescription>
              </FieldContent>
            </Field>
          ))}
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Save Preferences</Button>
      </CardFooter>
    </Card>
  )
}
