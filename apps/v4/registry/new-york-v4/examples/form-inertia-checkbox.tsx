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
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/registry/new-york-v4/ui/field"

const tasks = [
  { id: "push", label: "Push notifications" },
  { id: "email", label: "Email notifications" },
] as const

export default function FormInertiaCheckbox() {
  const form = useForm({
    responses: true,
    tasks: [] as string[],
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    form.clearErrors()

    if (form.data.tasks.length === 0) {
      form.setError("tasks", "Please select at least one notification type.")
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
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Manage your notification preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-inertia-checkbox" onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend variant="label">Responses</FieldLegend>
              <FieldDescription>
                Get notified for requests that take time, like research or
                image generation.
              </FieldDescription>
              <FieldGroup data-slot="checkbox-group">
                <Field orientation="horizontal">
                  <Checkbox
                    id="form-inertia-checkbox-responses"
                    name="responses"
                    checked={form.data.responses}
                    onCheckedChange={(checked) =>
                      form.setData("responses", checked === true)
                    }
                    disabled
                  />
                  <FieldLabel
                    htmlFor="form-inertia-checkbox-responses"
                    className="font-normal"
                  >
                    Push notifications
                  </FieldLabel>
                </Field>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet data-invalid={!!form.errors.tasks}>
              <FieldLegend variant="label">Tasks</FieldLegend>
              <FieldDescription>
                Get notified when tasks you&apos;ve created have updates.
              </FieldDescription>
              <FieldGroup data-slot="checkbox-group">
                {tasks.map((task) => (
                  <Field
                    key={task.id}
                    orientation="horizontal"
                    data-invalid={!!form.errors.tasks}
                  >
                    <Checkbox
                      id={`form-inertia-checkbox-${task.id}`}
                      name="tasks"
                      aria-invalid={!!form.errors.tasks}
                      checked={form.data.tasks.includes(task.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          form.setData("tasks", [...form.data.tasks, task.id])
                        } else {
                          form.setData(
                            "tasks",
                            form.data.tasks.filter((value) => value !== task.id)
                          )
                        }
                      }}
                    />
                    <FieldLabel
                      htmlFor={`form-inertia-checkbox-${task.id}`}
                      className="font-normal"
                    >
                      {task.label}
                    </FieldLabel>
                  </Field>
                ))}
              </FieldGroup>
              {form.errors.tasks && (
                <FieldError errors={[{ message: form.errors.tasks }]} />
              )}
            </FieldSet>
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
          <Button type="submit" form="form-inertia-checkbox">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
