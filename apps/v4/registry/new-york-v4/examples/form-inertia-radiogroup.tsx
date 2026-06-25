"use client"

import * as React from "react"
import { useForm } from "@inertiajs/react"
import { toast } from "sonner"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/registry/new-york-v4/ui/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/new-york-v4/ui/radio-group"

const plans = [
  {
    id: "starter",
    title: "Starter (100K tokens/month)",
    description: "For everyday use with basic features.",
  },
  {
    id: "pro",
    title: "Pro (1M tokens/month)",
    description: "For advanced AI usage with more features.",
  },
  {
    id: "enterprise",
    title: "Enterprise (Unlimited tokens)",
    description: "For large teams and heavy usage.",
  },
] as const

export default function FormInertiaRadioGroup() {
  const form = useForm({
    plan: "",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    form.clearErrors()

    if (!form.data.plan) {
      form.setError("plan", "You must select a subscription plan to continue.")
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
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>
          See pricing and features for each plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-inertia-radiogroup" onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Plan</FieldLegend>
              <FieldDescription>
                You can upgrade or downgrade your plan at any time.
              </FieldDescription>
              <RadioGroup
                name="plan"
                value={form.data.plan}
                onValueChange={(value) => form.setData("plan", value)}
              >
                {plans.map((plan) => (
                  <FieldLabel
                    key={plan.id}
                    htmlFor={`form-inertia-radiogroup-${plan.id}`}
                  >
                    <Field
                      orientation="horizontal"
                      data-invalid={!!form.errors.plan}
                    >
                      <FieldContent>
                        <FieldTitle>{plan.title}</FieldTitle>
                        <FieldDescription>{plan.description}</FieldDescription>
                      </FieldContent>
                      <RadioGroupItem
                        value={plan.id}
                        id={`form-inertia-radiogroup-${plan.id}`}
                        aria-invalid={!!form.errors.plan}
                      />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
              {form.errors.plan && (
                <FieldError errors={[{ message: form.errors.plan }]} />
              )}
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset()
              form.clearErrors()
            }}
          >
            Reset
          </Button>
          <Button type="submit" form="form-inertia-radiogroup">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
