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

const FormSchema = v.object({
  plan: v.pipe(
    v.string(),
    v.minLength(1, "You must select a subscription plan to continue.")
  ),
})

export default function FormFormischRadioGroup() {
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      plan: "",
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
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>
          See pricing and features for each plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form of={form} id="form-formisch-radiogroup" onSubmit={handleSubmit}>
          <FieldGroup>
            <FormischField of={form} path={["plan"]}>
              {(field) => (
                <FieldSet data-invalid={field.errors !== null}>
                  <FieldLegend>Plan</FieldLegend>
                  <FieldDescription>
                    You can upgrade or downgrade your plan at any time.
                  </FieldDescription>
                  <RadioGroup
                    value={field.input ?? ""}
                    onValueChange={(value) => field.onChange(value)}
                    aria-invalid={field.errors !== null}
                  >
                    {plans.map((plan) => (
                      <FieldLabel
                        key={plan.id}
                        htmlFor={`form-formisch-radiogroup-${plan.id}`}
                      >
                        <Field
                          orientation="horizontal"
                          data-invalid={field.errors !== null}
                        >
                          <FieldContent>
                            <FieldTitle>{plan.title}</FieldTitle>
                            <FieldDescription>
                              {plan.description}
                            </FieldDescription>
                          </FieldContent>
                          <RadioGroupItem
                            value={plan.id}
                            id={`form-formisch-radiogroup-${plan.id}`}
                            aria-invalid={field.errors !== null}
                          />
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </FieldSet>
              )}
            </FormischField>
          </FieldGroup>
        </Form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => reset(form)}>
            Reset
          </Button>
          <Button type="submit" form="form-formisch-radiogroup">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
