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

export default function FormInertiaInput() {
  const form = useForm({
    username: "",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    form.clearErrors()

    if (form.data.username.length < 3) {
      form.setError("username", "Username must be at least 3 characters.")
      return
    }
    if (form.data.username.length > 10) {
      form.setError("username", "Username must be at most 10 characters.")
      return
    }
    if (!/^[a-zA-Z0-9_]+$/.test(form.data.username)) {
      form.setError(
        "username",
        "Username can only contain letters, numbers, and underscores."
      )
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
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Update your profile information below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-inertia-input" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field data-invalid={!!form.errors.username}>
              <FieldLabel htmlFor="form-inertia-input-username">
                Username
              </FieldLabel>
              <Input
                id="form-inertia-input-username"
                name="username"
                value={form.data.username}
                onChange={(e) => form.setData("username", e.target.value)}
                aria-invalid={!!form.errors.username}
                placeholder="shadcn"
                autoComplete="username"
              />
              <FieldDescription>
                This is your public display name. Must be between 3 and 10
                characters. Must only contain letters, numbers, and
                underscores.
              </FieldDescription>
              {form.errors.username && (
                <FieldError errors={[{ message: form.errors.username }]} />
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
          <Button type="submit" form="form-inertia-input">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
