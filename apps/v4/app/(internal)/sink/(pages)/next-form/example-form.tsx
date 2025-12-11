"use client"

import * as React from "react"
import Form from "next/form"
import { z } from "zod"

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
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import { addons, exampleFormSchema } from "@/app/(internal)/sink/(pages)/schema"

import { subscriptionAction } from "./actions"

export type FormState = {
  values: z.infer<typeof exampleFormSchema>
  errors: null | Partial<
    Record<keyof z.infer<typeof exampleFormSchema>, string[]>
  >
  success: boolean
}

export function ExampleForm() {
  const formId = React.useId()
  const [formKey, setFormKey] = React.useState(formId)
  const [showResults, setShowResults] = React.useState(false)
  const [formState, formAction, pending] = React.useActionState<
    FormState,
    FormData
  >(subscriptionAction, {
    values: {
      name: "",
      email: "",
      plan: "basic",
      billingPeriod: "",
      addons: ["analytics"],
      teamSize: 1,
      emailNotifications: false,
      comments: "",
      startDate: new Date(),
      theme: "system",
      password: "",
    },
    errors: null,
    success: false,
  })

  React.useEffect(() => {
    if (formState.success) {
      setShowResults(true)
    }
  }, [formState.success])

  return (
    <>
      <Card className="w-full max-w-sm">
        <CardHeader className="border-b">
          <CardTitle>Subscription Form</CardTitle>
          <CardDescription>
            Create your subscription using server actions and useActionState.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form action={formAction} id="subscription-form" key={formKey}>
            <FieldGroup>
              <Field data-invalid={!!formState.errors?.name?.length}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  defaultValue={formState.values.name}
                  disabled={pending}
                  aria-invalid={!!formState.errors?.name?.length}
                  autoComplete="off"
                />
                <FieldDescription>Enter your name</FieldDescription>
                {formState.errors?.name && (
                  <FieldError>{formState.errors.name[0]}</FieldError>
                )}
              </Field>
              <Field data-invalid={!!formState.errors?.email?.length}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={formState.values.email}
                  disabled={pending}
                  aria-invalid={!!formState.errors?.email?.length}
                  autoComplete="off"
                />
                <FieldDescription>Enter your email address</FieldDescription>
                {formState.errors?.email && (
                  <FieldError>{formState.errors.email[0]}</FieldError>
                )}
              </Field>
              <FieldSeparator />
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
                {formState.errors?.billingPeriod && (
                  <FieldError>{formState.errors.billingPeriod[0]}</FieldError>
                )}
              </Field>
              <FieldSeparator />
              <FieldSet data-invalid={!!formState.errors?.addons?.length}>
                <FieldLegend>Add-ons</FieldLegend>
                <FieldDescription>
                  Select additional features you&apos;d like to include.
                </FieldDescription>
                <FieldGroup data-slot="checkbox-group">
                  {addons.map((addon) => (
                    <Field key={addon.id} orientation="horizontal">
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
                        <FieldLabel htmlFor={addon.id}>
                          {addon.title}
                        </FieldLabel>
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
              <Field data-invalid={!!formState.errors?.teamSize?.length}>
                <FieldLabel htmlFor="teamSize">Team Size</FieldLabel>
                <Input
                  id="teamSize"
                  name="teamSize"
                  type="number"
                  min="1"
                  max="50"
                  defaultValue={formState.values.teamSize.toString()}
                  disabled={pending}
                  aria-invalid={!!formState.errors?.teamSize?.length}
                />
                <FieldDescription>
                  How many people will be using the subscription? (1-50)
                </FieldDescription>
                {formState.errors?.teamSize && (
                  <FieldError>{formState.errors.teamSize[0]}</FieldError>
                )}
              </Field>
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
              <FieldSeparator />
              <Field data-invalid={!!formState.errors?.startDate?.length}>
                <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  defaultValue={
                    formState.values.startDate.toISOString().split("T")[0]
                  }
                  disabled={pending}
                  aria-invalid={!!formState.errors?.startDate?.length}
                />
                <FieldDescription>
                  Choose when your subscription should start
                </FieldDescription>
                {formState.errors?.startDate && (
                  <FieldError>{formState.errors.startDate[0]}</FieldError>
                )}
              </Field>
              <FieldSeparator />
              <Field data-invalid={!!formState.errors?.theme?.length}>
                <FieldLabel htmlFor="theme">Theme Preference</FieldLabel>
                <Select
                  name="theme"
                  defaultValue={formState.values.theme}
                  disabled={pending}
                  aria-invalid={!!formState.errors?.theme?.length}
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Choose your preferred color theme
                </FieldDescription>
                {formState.errors?.theme && (
                  <FieldError>{formState.errors.theme[0]}</FieldError>
                )}
              </Field>
              <FieldSeparator />
              <Field data-invalid={!!formState.errors?.password?.length}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  defaultValue={formState.values.password}
                  placeholder="Enter your password"
                  disabled={pending}
                  aria-invalid={!!formState.errors?.password?.length}
                />
                <FieldDescription>
                  Must contain uppercase, lowercase, number, and be 8+
                  characters
                </FieldDescription>
                {formState.errors?.password && (
                  <FieldError>{formState.errors.password[0]}</FieldError>
                )}
              </Field>
              <FieldSeparator />
              <Field data-invalid={!!formState.errors?.comments?.length}>
                <FieldLabel htmlFor="comments">Additional Comments</FieldLabel>
                <Textarea
                  id="comments"
                  name="comments"
                  defaultValue={formState.values.comments}
                  placeholder="Tell us more about your needs..."
                  rows={3}
                  disabled={pending}
                  aria-invalid={!!formState.errors?.comments?.length}
                />
                <FieldDescription>
                  Share any additional requirements or feedback (10-240
                  characters)
                </FieldDescription>
                {formState.errors?.comments && (
                  <FieldError>{formState.errors.comments[0]}</FieldError>
                )}
              </Field>
            </FieldGroup>
          </Form>
        </CardContent>
        <CardFooter className="border-t">
          <Field orientation="horizontal" className="justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              form="subscription-form"
              onClick={() => setFormKey(formKey + 1)}
            >
              Reset
            </Button>
            <Button type="submit" disabled={pending} form="subscription-form">
              {pending && <Spinner />}
              Create Subscription
            </Button>
          </Field>
        </CardFooter>
      </Card>
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscription Created!</DialogTitle>
            <DialogDescription>
              Here are the details of your subscription.
            </DialogDescription>
          </DialogHeader>
          <pre className="overflow-x-auto rounded-md bg-black p-4 font-mono text-sm text-white">
            <code>{JSON.stringify(formState.values, null, 2)}</code>
          </pre>
        </DialogContent>
      </Dialog>
    </>
  )
}
