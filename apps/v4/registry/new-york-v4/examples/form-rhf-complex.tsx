"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

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

const formSchema = z.object({
  plan: z
    .string({
      required_error: "Please select a subscription plan",
    })
    .min(1, "Please select a subscription plan")
    .refine((value) => value === "basic" || value === "pro", {
      message: "Invalid plan selection. Please choose Basic or Pro",
    }),
  billingPeriod: z
    .string({
      required_error: "Please select a billing period",
    })
    .min(1, "Please select a billing period"),
  addons: z
    .array(z.string())
    .min(1, "Please select at least one add-on")
    .max(3, "You can select up to 3 add-ons")
    .refine(
      (value) => value.every((addon) => addons.some((a) => a.id === addon)),
      {
        message: "You selected an invalid add-on",
      }
    ),
  emailNotifications: z.boolean(),
})

export default function FormRhfComplex() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: "basic",
      billingPeriod: "",
      addons: [],
      emailNotifications: false,
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
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
        <form id="form-rhf-complex" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="plan"
              control={form.control}
              render={({ field, fieldState }) => {
                const isInvalid = fieldState.invalid
                return (
                  <FieldSet data-invalid={isInvalid}>
                    <FieldLegend variant="label">Subscription Plan</FieldLegend>
                    <FieldDescription>
                      Choose your subscription plan.
                    </FieldDescription>
                    <RadioGroup
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      aria-invalid={isInvalid}
                    >
                      <FieldLabel htmlFor="form-rhf-complex-basic">
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>Basic</FieldTitle>
                            <FieldDescription>
                              For individuals and small teams
                            </FieldDescription>
                          </FieldContent>
                          <RadioGroupItem
                            value="basic"
                            id="form-rhf-complex-basic"
                          />
                        </Field>
                      </FieldLabel>
                      <FieldLabel htmlFor="form-rhf-complex-pro">
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>Pro</FieldTitle>
                            <FieldDescription>
                              For businesses with higher demands
                            </FieldDescription>
                          </FieldContent>
                          <RadioGroupItem
                            value="pro"
                            id="form-rhf-complex-pro"
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
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-complex-billingPeriod">
                    Billing Period
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-complex-billingPeriod"
                      aria-invalid={fieldState.invalid}
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <FieldSeparator />
            <Controller
              name="addons"
              control={form.control}
              render={({ field, fieldState }) => (
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
                        data-invalid={fieldState.invalid}
                      >
                        <Checkbox
                          id={`form-rhf-complex-${addon.id}`}
                          name={field.name}
                          aria-invalid={fieldState.invalid}
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
                          <FieldLabel htmlFor={`form-rhf-complex-${addon.id}`}>
                            {addon.title}
                          </FieldLabel>
                          <FieldDescription>
                            {addon.description}
                          </FieldDescription>
                        </FieldContent>
                      </Field>
                    ))}
                  </FieldGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldSet>
              )}
            />
            <FieldSeparator />
            <Controller
              name="emailNotifications"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf-complex-emailNotifications">
                      Email Notifications
                    </FieldLabel>
                    <FieldDescription>
                      Receive email updates about your subscription
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="form-rhf-complex-emailNotifications"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="border-t">
        <Field>
          <Button type="submit" form="form-rhf-complex">
            Save Preferences
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
