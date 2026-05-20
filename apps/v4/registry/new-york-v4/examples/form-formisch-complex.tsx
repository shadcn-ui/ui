"use client"

import * as React from "react"
import { Form, Field as FormischField, reset, useForm } from "@formisch/react"
import type { SubmitHandler } from "@formisch/react"
import { toast } from "sonner"
import * as v from "valibot"

import { Button } from "@/registry/new-york-v4/ui/button"
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

const addons = [
  {
    id: "analytics",
    title: "Analytics",
    description: "Advanced analytics and reporting",
  },
  {
    id: "backup",
    title: "Backup",
    description: "Automated daily backups",
  },
  {
    id: "support",
    title: "Priority Support",
    description: "24/7 premium customer support",
  },
] as const

const FormSchema = v.object({
  plan: v.pipe(
    v.string(),
    v.minLength(1, "Please select a subscription plan"),
    v.check(
      (value) => value === "basic" || value === "pro",
      "Invalid plan selection. Please choose Basic or Pro"
    )
  ),
  billingPeriod: v.pipe(
    v.string(),
    v.minLength(1, "Please select a billing period")
  ),
  addons: v.pipe(
    v.array(v.string()),
    v.minLength(1, "Please select at least one add-on"),
    v.maxLength(3, "You can select up to 3 add-ons"),
    v.check(
      (value) => value.every((addon) => addons.some((a) => a.id === addon)),
      "You selected an invalid add-on"
    )
  ),
  emailNotifications: v.boolean(),
})

export default function FormFormischComplex() {
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      plan: "basic",
      billingPeriod: "",
      addons: [],
      emailNotifications: false,
    },
  })

  const handleSubmit: SubmitHandler<typeof FormSchema> = (output) => {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(output, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="border-b">
        <CardTitle>You&apos;re almost there!</CardTitle>
        <CardDescription>
          Choose your subscription plan and billing period.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form of={form} id="form-formisch-complex" onSubmit={handleSubmit}>
          <FieldGroup>
            <FormischField of={form} path={["plan"]}>
              {(field) => (
                <FieldSet data-invalid={field.errors !== null}>
                  <FieldLegend variant="label">Subscription Plan</FieldLegend>
                  <FieldDescription>
                    Choose your subscription plan.
                  </FieldDescription>
                  <RadioGroup
                    value={field.input ?? ""}
                    onValueChange={(value) => field.onChange(value)}
                    aria-invalid={field.errors !== null}
                  >
                    <FieldLabel htmlFor="form-formisch-complex-basic">
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>Basic</FieldTitle>
                          <FieldDescription>
                            For individuals and small teams
                          </FieldDescription>
                        </FieldContent>
                        <RadioGroupItem
                          value="basic"
                          id="form-formisch-complex-basic"
                        />
                      </Field>
                    </FieldLabel>
                    <FieldLabel htmlFor="form-formisch-complex-pro">
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>Pro</FieldTitle>
                          <FieldDescription>
                            For businesses with higher demands
                          </FieldDescription>
                        </FieldContent>
                        <RadioGroupItem
                          value="pro"
                          id="form-formisch-complex-pro"
                        />
                      </Field>
                    </FieldLabel>
                  </RadioGroup>
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </FieldSet>
              )}
            </FormischField>
            <FieldSeparator />
            <FormischField of={form} path={["billingPeriod"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="form-formisch-complex-billingPeriod">
                    Billing Period
                  </FieldLabel>
                  <Select
                    value={field.input ?? ""}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger
                      id="form-formisch-complex-billingPeriod"
                      aria-invalid={field.errors !== null}
                    >
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
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>
            <FieldSeparator />
            <FormischField of={form} path={["addons"]}>
              {(field) => {
                const current = field.input ?? []
                return (
                  <FieldSet>
                    <FieldLegend>Add-ons</FieldLegend>
                    <FieldDescription>
                      Select additional features you&apos;d like to include.
                    </FieldDescription>
                    <FieldGroup data-slot="checkbox-group">
                      {addons.map((addon) => (
                        <Field
                          key={addon.id}
                          orientation="horizontal"
                          data-invalid={field.errors !== null}
                        >
                          <Checkbox
                            id={`form-formisch-complex-${addon.id}`}
                            aria-invalid={field.errors !== null}
                            checked={current.includes(addon.id)}
                            onCheckedChange={(checked) => {
                              field.onChange(
                                checked === true
                                  ? [...current, addon.id]
                                  : current.filter(
                                      (value) => value !== addon.id
                                    )
                              )
                            }}
                          />
                          <FieldContent>
                            <FieldLabel
                              htmlFor={`form-formisch-complex-${addon.id}`}
                            >
                              {addon.title}
                            </FieldLabel>
                            <FieldDescription>
                              {addon.description}
                            </FieldDescription>
                          </FieldContent>
                        </Field>
                      ))}
                    </FieldGroup>
                    {field.errors && (
                      <FieldError
                        errors={field.errors.map((message) => ({ message }))}
                      />
                    )}
                  </FieldSet>
                )
              }}
            </FormischField>
            <FieldSeparator />
            <FormischField of={form} path={["emailNotifications"]}>
              {(field) => (
                <Field
                  orientation="horizontal"
                  data-invalid={field.errors !== null}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-formisch-complex-emailNotifications">
                      Email Notifications
                    </FieldLabel>
                    <FieldDescription>
                      Receive email updates about your subscription
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="form-formisch-complex-emailNotifications"
                    checked={field.input ?? false}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    aria-invalid={field.errors !== null}
                  />
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>
          </FieldGroup>
        </Form>
      </CardContent>
      <CardFooter className="border-t">
        <Field>
          <Button type="submit" form="form-formisch-complex">
            Save Preferences
          </Button>
          <Button type="button" variant="outline" onClick={() => reset(form)}>
            Reset
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
