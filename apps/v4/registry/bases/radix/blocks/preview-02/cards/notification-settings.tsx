"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import { Checkbox } from "@/registry/bases/radix/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/registry/bases/radix/ui/field"

export function NotificationSettings() {
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
            <Checkbox id="notify-transactions" defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor="notify-transactions">
                Transaction alerts
              </FieldLabel>
              <FieldDescription>
                Deposits, withdrawals, and transfers.
              </FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="notify-security" defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor="notify-security">Security alerts</FieldLabel>
              <FieldDescription>
                Login attempts and account changes.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
