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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/registry/new-york-v4/ui/field"
import { Input } from "@/registry/new-york-v4/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/registry/new-york-v4/ui/input-group"

export default function FormInertiaDemo() {
  const form = useForm({
    title: "",
    description: "",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    form.clearErrors()

    const errors: Record<string, string> = {}
    if (form.data.title.length < 5) {
      errors.title = "Bug title must be at least 5 characters."
    } else if (form.data.title.length > 32) {
      errors.title = "Bug title must be at most 32 characters."
    }
    if (form.data.description.length < 20) {
      errors.description = "Description must be at least 20 characters."
    } else if (form.data.description.length > 100) {
      errors.description = "Description must be at most 100 characters."
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
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Bug Report</CardTitle>
        <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-inertia-demo" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field data-invalid={!!form.errors.title}>
              <FieldLabel htmlFor="form-inertia-demo-title">
                Bug Title
              </FieldLabel>
              <Input
                id="form-inertia-demo-title"
                name="title"
                value={form.data.title}
                onChange={(e) => form.setData("title", e.target.value)}
                aria-invalid={!!form.errors.title}
                placeholder="Login button not working on mobile"
                autoComplete="off"
              />
              {form.errors.title && (
                <FieldError errors={[{ message: form.errors.title }]} />
              )}
            </Field>
            <Field data-invalid={!!form.errors.description}>
              <FieldLabel htmlFor="form-inertia-demo-description">
                Description
              </FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  id="form-inertia-demo-description"
                  name="description"
                  value={form.data.description}
                  onChange={(e) =>
                    form.setData("description", e.target.value)
                  }
                  placeholder="I'm having an issue with the login button on mobile."
                  rows={6}
                  className="min-h-24 resize-none"
                  aria-invalid={!!form.errors.description}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {form.data.description.length}/100 characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Include steps to reproduce, expected behavior, and what
                actually happened.
              </FieldDescription>
              {form.errors.description && (
                <FieldError errors={[{ message: form.errors.description }]} />
              )}
            </Field>
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
          <Button type="submit" form="form-inertia-demo">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
