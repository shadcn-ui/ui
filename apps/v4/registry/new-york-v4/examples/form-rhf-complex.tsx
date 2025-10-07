"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/registry/new-york-v4/ui/button"
import { Card, CardContent, CardFooter } from "@/registry/new-york-v4/ui/card"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
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
import { Switch } from "@/registry/new-york-v4/ui/switch"

import { addons, formSchema, type FormState } from "./form-rhf-complex-schema"

export default function FormRhfComplex() {
  const form = useForm<FormState>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      plan: "basic",
      billingPeriod: "monthly",
      addons: [],
      emailNotifications: false,
    },
  })

  function onSubmit(data: FormState) {
    toast.success("Preferences saved", {
      description: "Your subscription plan has been updated.",
    })
  }

  return (
    <Card className="w-full max-w-sm">
      <CardContent>
        <form id="subscription-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
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
                          <RadioGroupItem value="basic" id="basic" />
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
                          <RadioGroupItem value="pro" id="pro" />
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
                    <FieldLabel htmlFor={field.name}>Billing Period</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      aria-invalid={isInvalid}
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder="Select" />
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
                  <FieldSet>
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
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="justify-end">
          <Button type="submit" form="subscription-form">
            Save Preferences
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
