"use client"

import { CircleAlertIcon } from "lucide-react"

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/styles/base-sera/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/styles/base-sera/ui/field"
import { Input } from "@/styles/base-sera/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/styles/base-sera/ui/select"

const ROLE_ITEMS = [
  { label: "Select a role...", value: null },
  { label: "Editor", value: "editor" },
  { label: "Writer", value: "writer" },
  { label: "Reviewer", value: "reviewer" },
]

export function FieldsCard() {
  return (
    <Card className="col-span-full md:col-span-6 lg:col-span-3">
      <CardHeader className="border-b">
        <CardTitle>Forms / Inputs</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="sera-email">Email Address</FieldLabel>
            <Input id="sera-email" type="email" placeholder="name@domain.com" />
          </Field>
          <Field>
            <FieldLabel htmlFor="sera-role">Publication Role</FieldLabel>
            <Select items={ROLE_ITEMS}>
              <SelectTrigger id="sera-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {ROLE_ITEMS.map((item) => (
                    <SelectItem key={item.label} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
