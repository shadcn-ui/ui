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

const FormSchema = v.object({
  username: v.pipe(
    v.string(),
    v.minLength(3, "Username must be at least 3 characters."),
    v.maxLength(10, "Username must be at most 10 characters."),
    v.regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores."
    )
  ),
})

export default function FormFormischInput() {
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      username: "",
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
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Update your profile information below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form of={form} id="form-formisch-input" onSubmit={handleSubmit}>
          <FieldGroup>
            <FormischField of={form} path={["username"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="form-formisch-input-username">
                    Username
                  </FieldLabel>
                  <Input
                    {...field.props}
                    id="form-formisch-input-username"
                    value={field.input ?? ""}
                    aria-invalid={field.errors !== null}
                    placeholder="shadcn"
                    autoComplete="username"
                  />
                  <FieldDescription>
                    This is your public display name. Must be between 3 and 10
                    characters. Must only contain letters, numbers, and
                    underscores.
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
          <Button type="submit" form="form-formisch-input">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
