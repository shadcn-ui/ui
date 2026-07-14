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

const FormSchema = v.object({
  title: v.pipe(
    v.string(),
    v.minLength(5, "Bug title must be at least 5 characters."),
    v.maxLength(32, "Bug title must be at most 32 characters.")
  ),
  description: v.pipe(
    v.string(),
    v.minLength(20, "Description must be at least 20 characters."),
    v.maxLength(100, "Description must be at most 100 characters.")
  ),
})

export default function BugReportForm() {
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      title: "",
      description: "",
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
        <CardTitle>Bug Report</CardTitle>
        <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form of={form} id="form-formisch-demo" onSubmit={handleSubmit}>
          <FieldGroup>
            <FormischField of={form} path={["title"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="form-formisch-demo-title">
                    Bug Title
                  </FieldLabel>
                  <Input
                    {...field.props}
                    id="form-formisch-demo-title"
                    value={field.input ?? ""}
                    aria-invalid={field.errors !== null}
                    placeholder="Login button not working on mobile"
                    autoComplete="off"
                  />
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>
            <FormischField of={form} path={["description"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="form-formisch-demo-description">
                    Description
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field.props}
                      id="form-formisch-demo-description"
                      value={field.input ?? ""}
                      placeholder="I'm having an issue with the login button on mobile."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={field.errors !== null}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {(field.input ?? "").length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Include steps to reproduce, expected behavior, and what
                    actually happened.
                  </FieldDescription>
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
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => reset(form)}>
            Reset
          </Button>
          <Button type="submit" form="form-formisch-demo">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
