"use client"

import * as React from "react"
import { useForm } from "@inertiajs/react"
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

export default function FormInertiaComplex() {
  const form = useForm({
    plan: "basic",
    billingPeriod: "monthly",
    addons: [] as string[],
    emailNotifications: false,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    form.clearErrors()

    const errors: Record<string, string> = {}
    if (!form.data.plan) {
      errors.plan = "Please select a subscription plan"
    } else if (form.data.plan !== "basic" && form.data.plan !== "pro") {
      errors.plan = "Invalid plan selection. Please choose Basic or Pro"
    }
    if (!form.data.billingPeriod) {
      errors.billingPeriod = "Please select a billing period"
    }
    if (form.data.addons.length === 0) {
      errors.addons = "Please select at least one add-on"
    } else if (form.data.addons.length > 3) {
      errors.addons = "You can select up to 3 add-ons"
    }
    if (Object.keys(errors).length > 0) {
      form.setError(errors)
      return
    }

    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(form.data, null, 2)}</code>
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
      <CardContent>
        <form id="form-inertia-complex" onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Subscription Plan</FieldLegend>
              <FieldDescription>
                Choose your subscription plan.
              </FieldDescription>
              <RadioGroup
                name="plan"
                value={form.data.plan}
                onValueChange={(value) => form.setData("plan", value)}
              >
                <FieldLabel htmlFor="form-inertia-complex-basic">
                  <Field
                    orientation="horizontal"
                    data-invalid={!!form.errors.plan}
                  >
                    <FieldContent>
                      <FieldTitle>Basic</FieldTitle>
                      <FieldDescription>
                        For individuals and small teams
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem
                      value="basic"
                      id="form-inertia-complex-basic"
                      aria-invalid={!!form.errors.plan}
                    />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="form-inertia-complex-pro">
                  <Field
                    orientation="horizontal"
                    data-invalid={!!form.errors.plan}
                  >
                    <FieldContent>
                      <FieldTitle>Pro</FieldTitle>
                      <FieldDescription>
                        For businesses with higher demands
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem
                      value="pro"
                      id="form-inertia-complex-pro"
                      aria-invalid={!!form.errors.plan}
                    />
                  </Field>
                </FieldLabel>
              </RadioGroup>
              {form.errors.plan && (
                <FieldError errors={[{ message: form.errors.plan }]} />
              )}
            </FieldSet>
            <FieldSeparator />
            <Field data-invalid={!!form.errors.billingPeriod}>
              <FieldLabel htmlFor="form-inertia-complex-billing">
                Billing Period
              </FieldLabel>
              <Select
                name="billingPeriod"
                value={form.data.billingPeriod}
                onValueChange={(value) =>
                  form.setData("billingPeriod", value)
                }
              >
                <SelectTrigger
                  id="form-inertia-complex-billing"
                  aria-invalid={!!form.errors.billingPeriod}
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
              {form.errors.billingPeriod && (
                <FieldError
                  errors={[{ message: form.errors.billingPeriod }]}
                />
              )}
            </Field>
            <FieldSeparator />
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
                    data-invalid={!!form.errors.addons}
                  >
                    <Checkbox
                      id={`form-inertia-complex-${addon.id}`}
                      name="addons"
                      aria-invalid={!!form.errors.addons}
                      checked={form.data.addons.includes(addon.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          form.setData("addons", [
                            ...form.data.addons,
                            addon.id,
                          ])
                        } else {
                          form.setData(
                            "addons",
                            form.data.addons.filter(
                              (value) => value !== addon.id
                            )
                          )
                        }
                      }}
                    />
                    <FieldContent>
                      <FieldLabel htmlFor={`form-inertia-complex-${addon.id}`}>
                        {addon.title}
                      </FieldLabel>
                      <FieldDescription>{addon.description}</FieldDescription>
                    </FieldContent>
                  </Field>
                ))}
              </FieldGroup>
              {form.errors.addons && (
                <FieldError errors={[{ message: form.errors.addons }]} />
              )}
            </FieldSet>
            <FieldSeparator />
            <Field
              orientation="horizontal"
              data-invalid={!!form.errors.emailNotifications}
            >
              <FieldContent>
                <FieldLabel htmlFor="form-inertia-complex-email">
                  Email Notifications
                </FieldLabel>
                <FieldDescription>
                  Receive email updates about your subscription
                </FieldDescription>
              </FieldContent>
              <Switch
                id="form-inertia-complex-email"
                name="emailNotifications"
                checked={form.data.emailNotifications}
                onCheckedChange={(checked) =>
                  form.setData("emailNotifications", checked)
                }
                aria-invalid={!!form.errors.emailNotifications}
              />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="justify-end">
          <Button type="submit" form="form-inertia-complex">
            Save Preferences
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
