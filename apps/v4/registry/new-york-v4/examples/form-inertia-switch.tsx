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
} from "@/registry/new-york-v4/ui/field"
import { Switch } from "@/registry/new-york-v4/ui/switch"

export default function FormInertiaSwitch() {
  const form = useForm({
    twoFactor: false,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    form.clearErrors()

    if (!form.data.twoFactor) {
      form.setError(
        "twoFactor",
        "It is highly recommended to enable two-factor authentication."
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
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Manage your account security preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-inertia-switch" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field
              orientation="horizontal"
              data-invalid={!!form.errors.twoFactor}
            >
              <FieldContent>
                <FieldLabel htmlFor="form-inertia-switch-twoFactor">
                  Multi-factor authentication
                </FieldLabel>
                <FieldDescription>
                  Enable multi-factor authentication to secure your account.
                </FieldDescription>
                {form.errors.twoFactor && (
                  <FieldError
                    errors={[{ message: form.errors.twoFactor }]}
                  />
                )}
              </FieldContent>
              <Switch
                id="form-inertia-switch-twoFactor"
                name="twoFactor"
                checked={form.data.twoFactor}
                onCheckedChange={(checked) =>
                  form.setData("twoFactor", checked)
                }
                aria-invalid={!!form.errors.twoFactor}
              />
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
          <Button type="submit" form="form-inertia-switch">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
