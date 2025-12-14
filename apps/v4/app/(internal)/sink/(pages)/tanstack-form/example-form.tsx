/* eslint-disable react/no-children-prop */
"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { format } from "date-fns"

import { Button } from "@/registry/new-york-v4/ui/button"
import { Calendar } from "@/registry/new-york-v4/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/registry/new-york-v4/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/registry/new-york-v4/ui/field"
import { Input } from "@/registry/new-york-v4/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/new-york-v4/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Slider } from "@/registry/new-york-v4/ui/slider"
import { Switch } from "@/registry/new-york-v4/ui/switch"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/new-york-v4/ui/toggle-group"
import { addons, exampleFormSchema } from "@/app/(internal)/sink/(pages)/schema"

export function ExampleForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      plan: "",
      billingPeriod: "",
      addons: ["analytics"],
      emailNotifications: false,
      teamSize: 1,
      comments: "",
      startDate: new Date(),
      theme: "system",
      password: "",
    },
    validators: {
      onChange: exampleFormSchema,
    },
    onSubmit: async ({ value }) => {
      setValues(value)
      setOpen(true)
    },
  })
  const [values, setValues] = React.useState<typeof form.state.values>()
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Card className="w-full max-w-sm">
        <CardHeader className="border-b">
          <CardTitle>Example Form</CardTitle>
          <CardDescription>
            This is an example form using TanStack Form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="example-form"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              void form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="off"
                      />
                      <FieldDescription>Enter your name</FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="off"
                      />
                      <FieldDescription>
                        Enter your email address
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              <FieldSeparator />
              <form.Field
                name="plan"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <FieldSet data-invalid={isInvalid}>
                      <FieldLegend>Subscription Plan</FieldLegend>
                      <FieldDescription>
                        Choose your subscription plan.
                      </FieldDescription>
                      <RadioGroup
                        name={field.name}
                        value={field.state.value}
                        onValueChange={field.handleChange}
                        aria-invalid={isInvalid}
                      >
                        <FieldLabel htmlFor="basic">
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldTitle>Basic</FieldTitle>
                              <FieldDescription>
                                For individuals and small teams
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem
                              value="basic"
                              id="basic"
                              aria-invalid={isInvalid}
                            />
                          </Field>
                        </FieldLabel>
                        <FieldLabel htmlFor="pro">
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldTitle>Pro</FieldTitle>
                              <FieldDescription>
                                For businesses with higher demands
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem
                              value="pro"
                              id="pro"
                              aria-invalid={isInvalid}
                            />
                          </Field>
                        </FieldLabel>
                      </RadioGroup>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldSet>
                  )
                }}
              />
              <FieldSeparator />
              <form.Field
                name="billingPeriod"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Billing Period
                      </FieldLabel>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={field.handleChange}
                        aria-invalid={isInvalid}
                      >
                        <SelectTrigger id={field.name}>
                          <SelectValue placeholder="Select billing period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldDescription>
                        Choose how often you want to be billed.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              <FieldSeparator />
              <form.Field
                name="addons"
                mode="array"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <FieldSet data-invalid={isInvalid}>
                      <FieldLegend>Add-ons</FieldLegend>
                      <FieldDescription>
                        Select additional features you&apos;d like to include.
                      </FieldDescription>
                      <FieldGroup data-slot="checkbox-group">
                        {addons.map((addon) => (
                          <Field key={addon.id} orientation="horizontal">
                            <Checkbox
                              id={addon.id}
                              name={field.name}
                              aria-invalid={isInvalid}
                              checked={field.state.value.includes(addon.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.pushValue(addon.id)
                                } else {
                                  const index = field.state.value.indexOf(
                                    addon.id
                                  )
                                  if (index > -1) {
                                    field.removeValue(index)
                                  }
                                }
                              }}
                            />
                            <FieldContent>
                              <FieldLabel htmlFor={addon.id}>
                                {addon.title}
                              </FieldLabel>
                              <FieldDescription>
                                {addon.description}
                              </FieldDescription>
                            </FieldContent>
                          </Field>
                        ))}
                      </FieldGroup>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldSet>
                  )
                }}
              />
              <FieldSeparator />
              <form.Field
                name="teamSize"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldTitle>Team Size</FieldTitle>
                      <FieldDescription>
                        How many people will be using the subscription?
                      </FieldDescription>
                      <Slider
                        id={field.name}
                        name={field.name}
                        value={[field.state.value]}
                        onValueChange={(value) => field.handleChange(value[0])}
                        min={1}
                        max={50}
                        step={10}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              <FieldSeparator />
              <form.Field
                name="emailNotifications"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldLabel htmlFor={field.name}>
                          Email Notifications
                        </FieldLabel>
                        <FieldDescription>
                          Receive email updates about your subscription
                        </FieldDescription>
                      </FieldContent>
                      <Switch
                        id={field.name}
                        name={field.name}
                        checked={field.state.value}
                        onCheckedChange={field.handleChange}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              <FieldSeparator />
              <form.Field
                name="startDate"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Start Date</FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id={field.name}
                            variant="outline"
                            className="justify-start"
                          >
                            {field.state.value ? (
                              format(field.state.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            required
                            mode="single"
                            selected={field.state.value}
                            onSelect={field.handleChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <FieldDescription>
                        Choose when your subscription should start
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              <FieldSeparator />
              <form.Field
                name="theme"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldTitle>Theme Preference</FieldTitle>
                      <ToggleGroup
                        id={field.name}
                        type="single"
                        variant="outline"
                        value={field.state.value}
                        onValueChange={(value) =>
                          value && field.handleChange(value)
                        }
                        aria-invalid={isInvalid}
                      >
                        <ToggleGroupItem value="light">Light</ToggleGroupItem>
                        <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
                        <ToggleGroupItem value="system">System</ToggleGroupItem>
                      </ToggleGroup>
                      <FieldDescription>
                        Choose your preferred color theme
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              <FieldSeparator />
              <form.Field
                name="password"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Enter your password"
                        aria-invalid={isInvalid}
                      />
                      <FieldDescription>
                        Must contain uppercase, lowercase, number, and be 8+
                        characters
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              <FieldSeparator />
              <form.Field
                name="comments"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Additional Comments
                      </FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Tell us more about your needs..."
                        rows={3}
                        aria-invalid={isInvalid}
                      />
                      <FieldDescription>
                        Share any additional requirements or feedback (10-240
                        characters)
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="border-t">
          <Field orientation="horizontal" className="justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" form="example-form">
              Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submitted Values</DialogTitle>
            <DialogDescription>
              Here are the values you submitted.
            </DialogDescription>
          </DialogHeader>
          <pre className="overflow-x-auto rounded-md bg-black p-4 font-mono text-sm text-white">
            <code>{JSON.stringify(values, null, 2)}</code>
          </pre>
        </DialogContent>
      </Dialog>
    </>
  )
}
