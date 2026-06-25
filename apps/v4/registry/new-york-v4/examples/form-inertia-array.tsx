"use client"

import * as React from "react"
import { useForm } from "@inertiajs/react"
import { XIcon } from "lucide-react"
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
  FieldLegend,
  FieldSet,
} from "@/registry/new-york-v4/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/new-york-v4/ui/input-group"

type EmailEntry = { address: string }

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function FormInertiaArray() {
  const form = useForm({
    emails: [{ address: "" }] as EmailEntry[],
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    form.clearErrors()

    const errors: Record<string, string> = {}
    if (form.data.emails.length < 1) {
      errors.emails = "Add at least one email address."
    } else if (form.data.emails.length > 5) {
      errors.emails = "You can add up to 5 email addresses."
    }
    form.data.emails.forEach((email, index) => {
      if (!emailPattern.test(email.address)) {
        errors[`emails.${index}.address`] = "Enter a valid email address."
      }
    })
    if (Object.keys(errors).length > 0) {
      form.setError(errors as never)
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

  function addEmail() {
    form.setData("emails", [...form.data.emails, { address: "" }])
  }

  function removeEmail(index: number) {
    form.setData(
      "emails",
      form.data.emails.filter((_, i) => i !== index)
    )
  }

  function updateEmail(index: number, value: string) {
    form.setData(
      "emails",
      form.data.emails.map((item, i) =>
        i === index ? { ...item, address: value } : item
      )
    )
  }

  const errors = form.errors as Record<string, string>

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="border-b">
        <CardTitle>Contact Emails</CardTitle>
        <CardDescription>Manage your contact email addresses.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-inertia-array" onSubmit={handleSubmit}>
          <FieldSet className="gap-4">
            <FieldLegend variant="label">Email Addresses</FieldLegend>
            <FieldDescription>
              Add up to 5 email addresses where we can contact you.
            </FieldDescription>
            <FieldGroup className="gap-4">
              {form.data.emails.map((email, index) => {
                const emailError = errors[`emails.${index}.address`]
                return (
                  <Field
                    key={index}
                    orientation="horizontal"
                    data-invalid={!!emailError}
                  >
                    <FieldContent>
                      <InputGroup>
                        <InputGroupInput
                          id={`form-inertia-array-email-${index}`}
                          name={`emails.${index}.address`}
                          value={email.address}
                          onChange={(e) => updateEmail(index, e.target.value)}
                          aria-invalid={!!emailError}
                          placeholder="name@example.com"
                          type="email"
                          autoComplete="email"
                        />
                        {form.data.emails.length > 1 && (
                          <InputGroupAddon align="inline-end">
                            <InputGroupButton
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => removeEmail(index)}
                              aria-label={`Remove email ${index + 1}`}
                            >
                              <XIcon />
                            </InputGroupButton>
                          </InputGroupAddon>
                        )}
                      </InputGroup>
                      {emailError && (
                        <FieldError errors={[{ message: emailError }]} />
                      )}
                    </FieldContent>
                  </Field>
                )
              })}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEmail}
                disabled={form.data.emails.length >= 5}
              >
                Add Email Address
              </Button>
            </FieldGroup>
            {errors.emails && (
              <FieldError errors={[{ message: errors.emails }]} />
            )}
          </FieldSet>
        </form>
      </CardContent>
      <CardFooter className="border-t">
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
          <Button type="submit" form="form-inertia-array">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
