"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

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
  const [values, setValues] = useState<z.infer<typeof exampleFormSchema>>()
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof exampleFormSchema>>({
    resolver: zodResolver(exampleFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      plan: "basic" as const,
      billingPeriod: "",
      addons: ["analytics"],
      emailNotifications: false,
      teamSize: 1,
      comments: "",
      startDate: new Date(),
      theme: "system",
      password: "",
    },
  })

  function onSubmit(data: z.infer<typeof exampleFormSchema>) {
    setValues(data)
    setOpen(true)
  }

  return (
    <>
      <Card className="w-full max-w-sm">
        <CardHeader className="border-b">
          <CardTitle>React Hook Form</CardTitle>
          <CardDescription>
            This form uses React Hook Form with Zod validation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="subscription-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => {
                  const isInvalid = fieldState.invalid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={isInvalid}
                        autoComplete="off"
                      />
                      <FieldDescription>Enter your name</FieldDescription>
                      {isInvalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )
                }}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => {
                  const isInvalid = fieldState.invalid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        {...field}
                        type="email"
                        id={field.name}
                        aria-invalid={isInvalid}
                        autoComplete="off"
                      />
                      <FieldDescription>
                        Enter your email address
                      </FieldDescription>
                      {isInvalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )
                }}
              />
              <FieldSeparator />
              <Controller
                name="plan"
                control={form.control}
                render={({ field, fieldState }) => {
                  const isInvalid = fieldState.invalid
                  return (
                    <FieldSet data-invalid={isInvalid}>
                      <FieldLegend>Subscription Plan</FieldLegend>
                      <FieldDescription>
                        Choose your subscription plan.
                      </FieldDescription>
                      <RadioGroup
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
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
                      {isInvalid && <FieldError errors={[fieldState.error]} />}
                    </FieldSet>
                  )
                }}
              />
              <FieldSeparator />
              <Controller
                name="billingPeriod"
                control={form.control}
                render={({ field, fieldState }) => {
                  const isInvalid = fieldState.invalid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Billing Period
                      </FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
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
                      {isInvalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )
                }}
              />
              <FieldSeparator />
              <Controller
                name="addons"
                control={form.control}
                render={({ field, fieldState }) => {
                  const isInvalid = fieldState.invalid
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
                              checked={field.value.includes(addon.id)}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...field.value, addon.id]
                                  : field.value.filter(
                                      (value) => value !== addon.id
                                    )
                                field.onChange(newValue)
                                field.onBlur()
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
                      {isInvalid && <FieldError errors={[fieldState.error]} />}
                    </FieldSet>
                  )
                }}
              />
              <FieldSeparator />
              <Controller
                name="teamSize"
                control={form.control}
                render={({ field, fieldState }) => {
                  const isInvalid = fieldState.invalid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldTitle>Team Size</FieldTitle>
                      <FieldDescription>
                        How many people will be using the subscription?
                      </FieldDescription>
                      <Slider
                        id={field.name}
                        name={field.name}
                        value={[field.value]}
                        onValueChange={field.onChange}
                        min={1}
                        max={50}
                        step={1}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )
                }}
              />
              <FieldSeparator />
              <Controller
                name="emailNotifications"
                control={form.control}
                render={({ field, fieldState }) => {
                  const isInvalid = fieldState.invalid
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
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )
                }}
              />
              <FieldSeparator />
              <Controller
                name="startDate"
                control={form.control}
                render={({ field, fieldState }) => {
                  const isInvalid = fieldState.invalid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Start Date</FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id={field.name}
                            variant="outline"
                            className="justify-start"
                            aria-invalid={isInvalid}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            required
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <FieldDescription>
                        Choose when your subscription should start
                      </FieldDescription>
                      {isInvalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )
                }}
              />
              <FieldSeparator />
              <Controller
                name="theme"
                control={form.control}
                render={({ field, fieldState }) => {
                  const isInvalid = fieldState.invalid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldTitle>Theme Preference</FieldTitle>
                      <ToggleGroup
                        type="single"
                        variant="outline"
                        value={field.value}
                        onValueChange={(value) =>
                          value && field.onChange(value)
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
                      {isInvalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )
                }}
              />
              <FieldSeparator />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => {
                  const isInvalid = fieldState.invalid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        id={field.name}
                        aria-invalid={isInvalid}
                      />
                      <FieldDescription>
                        Must contain uppercase, lowercase, number, and be 8+
                        characters
                      </FieldDescription>
                      {isInvalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )
                }}
              />
              <FieldSeparator />
              <Controller
                name="comments"
                control={form.control}
                render={({ field, fieldState }) => {
                  const isInvalid = fieldState.invalid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Additional Comments
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
                        placeholder="Tell us more about your needs..."
                        rows={3}
                        aria-invalid={isInvalid}
                      />
                      <FieldDescription>
                        Share any additional requirements or feedback (10-240
                        characters)
                      </FieldDescription>
                      {isInvalid && <FieldError errors={[fieldState.error]} />}
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
            <Button type="submit" form="subscription-form">
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
