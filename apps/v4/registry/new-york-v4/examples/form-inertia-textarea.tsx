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
import { Textarea } from "@/registry/new-york-v4/ui/textarea"

export default function FormInertiaTextarea() {
  const form = useForm({
    about: "",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    form.clearErrors()

    if (form.data.about.length < 10) {
      form.setError("about", "Please provide at least 10 characters.")
      return
    }
    if (form.data.about.length > 200) {
      form.setError("about", "Please keep it under 200 characters.")
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
        <CardTitle>Personalization</CardTitle>
        <CardDescription>
          Customize your experience by telling us more about yourself.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-inertia-textarea" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field data-invalid={!!form.errors.about}>
              <FieldLabel htmlFor="form-inertia-textarea-about">
                More about you
              </FieldLabel>
              <Textarea
                id="form-inertia-textarea-about"
                name="about"
                value={form.data.about}
                onChange={(e) => form.setData("about", e.target.value)}
                aria-invalid={!!form.errors.about}
                placeholder="I'm a software engineer..."
                className="min-h-[120px]"
              />
              <FieldDescription>
                Tell us more about yourself. This will be used to help us
                personalize your experience.
              </FieldDescription>
              {form.errors.about && (
                <FieldError errors={[{ message: form.errors.about }]} />
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
          <Button type="submit" form="form-inertia-textarea">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
