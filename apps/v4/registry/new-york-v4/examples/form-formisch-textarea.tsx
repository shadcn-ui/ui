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
import { Textarea } from "@/registry/new-york-v4/ui/textarea"

const FormSchema = v.object({
  about: v.pipe(
    v.string(),
    v.minLength(10, "Please provide at least 10 characters."),
    v.maxLength(200, "Please keep it under 200 characters.")
  ),
})

export default function FormFormischTextarea() {
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      about: "",
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
        <CardTitle>Personalization</CardTitle>
        <CardDescription>
          Customize your experience by telling us more about yourself.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form of={form} id="form-formisch-textarea" onSubmit={handleSubmit}>
          <FieldGroup>
            <FormischField of={form} path={["about"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="form-formisch-textarea-about">
                    More about you
                  </FieldLabel>
                  <Textarea
                    {...field.props}
                    id="form-formisch-textarea-about"
                    value={field.input ?? ""}
                    aria-invalid={field.errors !== null}
                    placeholder="I'm a software engineer..."
                    className="min-h-[120px]"
                  />
                  <FieldDescription>
                    Tell us more about yourself. This will be used to help us
                    personalize your experience.
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
          <Button type="submit" form="form-formisch-textarea">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
