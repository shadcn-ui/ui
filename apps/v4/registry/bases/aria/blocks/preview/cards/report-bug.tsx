"use client"

import { Button } from "@/registry/bases/aria/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/aria/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/registry/bases/aria/ui/field"
import { Input } from "@/registry/bases/aria/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/aria/ui/select"
import { Textarea } from "@/registry/bases/aria/ui/textarea"

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
              <Select defaultValue="medium">
                <SelectTrigger id="bug-severity" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem id="critical">Critical</SelectItem>
                    <SelectItem id="high">High</SelectItem>
                    <SelectItem id="medium">Medium</SelectItem>
                    <SelectItem id="low">Low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="bug-component">Component</FieldLabel>
              <Select defaultValue="dashboard">
                <SelectTrigger id="bug-component" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem id="dashboard">Dashboard</SelectItem>
                    <SelectItem id="auth">Auth</SelectItem>
                    <SelectItem id="api">API</SelectItem>
                    <SelectItem id="billing">Billing</SelectItem>
                  </SelectGroup>
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
        <Field
          orientation="horizontal"
          className="justify-end style-sera:justify-center"
        >
          <Button variant="outline" className="style-sera:flex-1">
            Attach File
          </Button>
          <Button className="style-sera:flex-1">Submit Bug</Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
