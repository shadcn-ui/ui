"use client"

import * as React from "react"
import Form from "next/form"
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
import { Spinner } from "@/registry/new-york-v4/ui/spinner"

import { formAction as formActionServer } from "./form-next-input-textarea-action"
import { type FormState } from "./form-next-input-textarea-schema"

export default function FormNextInputTextarea() {
  const formId = React.useId()
  const [formKey, setFormKey] = React.useState(formId)
  const [formState, formAction, pending] = React.useActionState<
    FormState,
    FormData
  >(formActionServer, {
    values: {
      title: "",
      description: "",
    },
    errors: null,
    success: false,
  })
  const [descriptionLength, setDescriptionLength] = React.useState(0)

  React.useEffect(() => {
    if (formState.success) {
      toast("Thank you for your feedback", {
        description: "We'll review your report and get back to you soon.",
      })

      // Reset the form.
      setFormKey(formKey + 1)
      setDescriptionLength(0)
    }
  }, [formState.success])

  React.useEffect(() => {
    setDescriptionLength(formState.values.description.length)
  }, [formState.values.description])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Bug Report</CardTitle>
        <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form action={formAction} id={`form-${formId}`} key={formKey}>
          <FieldGroup>
            <Field data-invalid={!!formState.errors?.title?.length}>
              <FieldLabel htmlFor="title">Bug Title</FieldLabel>
              <Input
                id="title"
                name="title"
                defaultValue={formState.values.title}
                disabled={pending}
                aria-invalid={!!formState.errors?.title?.length}
                placeholder="Login button not working on mobile"
                autoComplete="off"
              />
              {formState.errors?.title && (
                <FieldError>{formState.errors.title[0]}</FieldError>
              )}
            </Field>
            <Field data-invalid={!!formState.errors?.description?.length}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  id="description"
                  name="description"
                  defaultValue={formState.values.description}
                  placeholder="I'm having an issue with the login button on mobile."
                  rows={6}
                  className="min-h-24 resize-none"
                  disabled={pending}
                  aria-invalid={!!formState.errors?.description?.length}
                  onChange={(e) => setDescriptionLength(e.target.value.length)}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {descriptionLength}/100 characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Include steps to reproduce, expected behavior, and what actually
                happened.
              </FieldDescription>
              {formState.errors?.description && (
                <FieldError>{formState.errors.description[0]}</FieldError>
              )}
            </Field>
          </FieldGroup>
        </Form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" disabled={pending} form={`form-${formId}`}>
            {pending && <Spinner />}
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
