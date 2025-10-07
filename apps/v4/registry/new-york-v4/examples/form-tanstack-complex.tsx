/* eslint-disable react/no-children-prop */
"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
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

import { addons, formSchema } from "./form-tanstack-complex-schema"

export default function FormTanstackComplex() {
  const form = useForm({
    defaultValues: {
      plan: "basic",
      billingPeriod: "monthly",
      addons: [] as string[],
      emailNotifications: false,
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      toast.success("Preferences saved", {
        description: "Your subscription plan has been updated.",
      })
    },
  })

  return (
    <Card className="w-full max-w-sm">
      <CardContent>
        <form
          id="subscription-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <FieldGroup>
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
                    <FieldLabel htmlFor={field.name}>Billing Period</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
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
