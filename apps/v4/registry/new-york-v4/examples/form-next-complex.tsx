"use client"

import * as React from "react"
import Form from "next/form"
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
import { Spinner } from "@/registry/new-york-v4/ui/spinner"
import { Switch } from "@/registry/new-york-v4/ui/switch"

import { complexFormAction } from "./form-next-complex-action"
import { addons, type FormState } from "./form-next-complex-schema"

export default function FormNextComplex() {
  const [formState, formAction, pending] = React.useActionState<
    FormState,
    FormData
  >(complexFormAction, {
    values: {
      plan: "basic",
      billingPeriod: "monthly",
      addons: [],
      emailNotifications: false,
    },
    errors: null,
    success: false,
  })

  React.useEffect(() => {
    if (formState.success) {
      toast.success("Preferences saved", {
        description: "Your subscription plan has been updated.",
      })
    }
  }, [formState.success])

  return (
    <Card className="w-full max-w-sm">
      <CardContent>
        <Form action={formAction} id="subscription-form">
          <FieldGroup>
            <FieldSet data-invalid={!!formState.errors?.plan?.length}>
              <FieldLegend>Subscription Plan</FieldLegend>
              <FieldDescription>
                Choose your subscription plan.
              </FieldDescription>
              <RadioGroup
                name="plan"
                defaultValue={formState.values.plan}
                disabled={pending}
                aria-invalid={!!formState.errors?.plan?.length}
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
              {formState.errors?.plan && (
                <FieldError>{formState.errors.plan[0]}</FieldError>
              )}
            </FieldSet>
            <FieldSeparator />
            <Field data-invalid={!!formState.errors?.billingPeriod?.length}>
              <FieldLabel htmlFor="billingPeriod">Billing Period</FieldLabel>
              <Select
                name="billingPeriod"
                defaultValue={formState.values.billingPeriod}
                disabled={pending}
                aria-invalid={!!formState.errors?.billingPeriod?.length}
              >
                <SelectTrigger id="billingPeriod">
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
              {formState.errors?.billingPeriod && (
                <FieldError>{formState.errors.billingPeriod[0]}</FieldError>
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
                    data-invalid={!!formState.errors?.addons?.length}
                  >
                    <Checkbox
                      id={addon.id}
                      name="addons"
                      value={addon.id}
                      defaultChecked={formState.values.addons.includes(
                        addon.id
                      )}
                      disabled={pending}
                      aria-invalid={!!formState.errors?.addons?.length}
                    />
                    <FieldContent>
                      <FieldLabel htmlFor={addon.id}>{addon.title}</FieldLabel>
                      <FieldDescription>{addon.description}</FieldDescription>
                    </FieldContent>
                  </Field>
                ))}
              </FieldGroup>
              {formState.errors?.addons && (
                <FieldError>{formState.errors.addons[0]}</FieldError>
              )}
            </FieldSet>
            <FieldSeparator />
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor="emailNotifications">
                  Email Notifications
                </FieldLabel>
                <FieldDescription>
                  Receive email updates about your subscription
                </FieldDescription>
              </FieldContent>
              <Switch
                id="emailNotifications"
                name="emailNotifications"
                defaultChecked={formState.values.emailNotifications}
                disabled={pending}
                aria-invalid={!!formState.errors?.emailNotifications?.length}
              />
            </Field>
          </FieldGroup>
        </Form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="justify-end">
          <Button type="submit" disabled={pending} form="subscription-form">
            {pending && <Spinner />}
            Save Preferences
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
