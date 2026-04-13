"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/styles/base-sera/ui/card"
import { Checkbox } from "@/styles/base-sera/ui/checkbox"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/styles/base-sera/ui/field"
import { RadioGroup, RadioGroupItem } from "@/styles/base-sera/ui/radio-group"
import { Switch } from "@/styles/base-sera/ui/switch"

export function ControlsCard() {
  return (
    <Card className="col-span-full md:col-span-6 lg:col-span-3">
      <CardHeader className="border-b">
        <CardTitle>Forms / Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="sera-digest">Daily Digest</FieldLabel>
            <Switch id="sera-digest" defaultChecked />
          </Field>
          <Field>
            <Field orientation="horizontal">
              <Checkbox id="sera-standard" defaultChecked />
              <FieldLabel htmlFor="sera-standard">Standard Layout</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="sera-compact" />
              <FieldLabel htmlFor="sera-compact">Compact Layout</FieldLabel>
            </Field>
          </Field>
          <RadioGroup defaultValue="grid">
            <Field orientation="horizontal">
              <RadioGroupItem value="grid" id="sera-grid" />
              <FieldLabel htmlFor="sera-grid">Grid View</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="list" id="sera-list" />
              <FieldLabel htmlFor="sera-list">List View</FieldLabel>
            </Field>
          </RadioGroup>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
