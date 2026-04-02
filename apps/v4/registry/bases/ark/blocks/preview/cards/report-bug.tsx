"use client"

import { Button } from "@/registry/bases/ark/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/ark/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/registry/bases/ark/ui/field"
import { Input } from "@/registry/bases/ark/ui/input"
import {
  createListCollection,
  Select,
  SelectContent,
  SelectControl,
  SelectHiddenSelect,
  SelectIndicator,
  SelectIndicatorGroup,
  SelectItem,
  SelectItemGroup,
  SelectItemIndicator,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/ark/ui/select"
import { Textarea } from "@/registry/bases/ark/ui/textarea"

const severityCollection = createListCollection({
  items: [
    { label: "Critical", value: "critical" },
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ],
})

const componentCollection = createListCollection({
  items: [
    { label: "Dashboard", value: "dashboard" },
    { label: "Auth", value: "auth" },
    { label: "API", value: "api" },
    { label: "Billing", value: "billing" },
  ],
})

export function ReportBug() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Bug</CardTitle>
        <CardDescription>Help us fix issues faster.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="bug-title">Title</FieldLabel>
            <Input
              id="bug-title"
              placeholder="Brief description of the issue"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="bug-severity">Severity</FieldLabel>
              <Select
                collection={severityCollection}
                defaultValue={["medium"]}
              >
                <SelectHiddenSelect />
                <SelectControl>
                  <SelectTrigger id="bug-severity" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectIndicatorGroup>
                    <SelectIndicator />
                  </SelectIndicatorGroup>
                </SelectControl>
                <SelectContent>
                  <SelectItemGroup>
                    {severityCollection.items.map((item) => (
                      <SelectItem key={item.value} item={item}>
                        <SelectItemText>{item.label}</SelectItemText>
                        <SelectItemIndicator />
                      </SelectItem>
                    ))}
                  </SelectItemGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="bug-component">Component</FieldLabel>
              <Select
                collection={componentCollection}
                defaultValue={["dashboard"]}
              >
                <SelectHiddenSelect />
                <SelectControl>
                  <SelectTrigger id="bug-component" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectIndicatorGroup>
                    <SelectIndicator />
                  </SelectIndicatorGroup>
                </SelectControl>
                <SelectContent>
                  <SelectItemGroup>
                    {componentCollection.items.map((item) => (
                      <SelectItem key={item.value} item={item}>
                        <SelectItemText>{item.label}</SelectItemText>
                        <SelectItemIndicator />
                      </SelectItem>
                    ))}
                  </SelectItemGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="bug-steps">Steps to reproduce</FieldLabel>
            <Textarea
              id="bug-steps"
              placeholder="1. Go to&#10;2. Click on&#10;3. Observe..."
              className="min-h-24 resize-none"
            />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="justify-end">
          <Button variant="outline">Attach File</Button>
          <Button>Submit Bug</Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
