"use client"

import * as React from "react"
import {
  FieldArray,
  Form,
  Field as FormischField,
  insert,
  remove,
  reset,
  useForm,
} from "@formisch/react"
import type { SubmitHandler } from "@formisch/react"
import { XIcon } from "lucide-react"
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

const FormSchema = v.object({
  emails: v.pipe(
    v.array(
      v.object({
        address: v.pipe(
          v.string(),
          v.nonEmpty("Enter an email address."),
          v.email("Enter a valid email address.")
        ),
      })
    ),
    v.minLength(1, "Add at least one email address."),
    v.maxLength(5, "You can add up to 5 email addresses.")
  ),
})

export default function FormFormischArray() {
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      emails: [{ address: "" }, { address: "" }],
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
      <CardHeader className="border-b">
        <CardTitle>Contact Emails</CardTitle>
        <CardDescription>Manage your contact email addresses.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form of={form} id="form-formisch-array" onSubmit={handleSubmit}>
          <FieldArray of={form} path={["emails"]}>
            {(fieldArray) => (
              <FieldSet className="gap-4">
                <FieldLegend variant="label">Email Addresses</FieldLegend>
                <FieldDescription>
                  Add up to 5 email addresses where we can contact you.
                </FieldDescription>
                <FieldGroup className="gap-4">
                  {fieldArray.items.map((item, index) => (
                    <FormischField
                      key={item}
                      of={form}
                      path={["emails", index, "address"]}
                    >
                      {(field) => (
                        <Field
                          orientation="horizontal"
                          data-invalid={field.errors !== null}
                        >
                          <FieldContent>
                            <InputGroup>
                              <InputGroupInput
                                {...field.props}
                                id={`form-formisch-array-email-${index}`}
                                value={field.input ?? ""}
                                aria-invalid={field.errors !== null}
                                placeholder="name@example.com"
                                type="email"
                                autoComplete="email"
                              />
                              {fieldArray.items.length > 1 && (
                                <InputGroupAddon align="inline-end">
                                  <InputGroupButton
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() =>
                                      remove(form, {
                                        path: ["emails"],
                                        at: index,
                                      })
                                    }
                                    aria-label={`Remove email ${index + 1}`}
                                  >
                                    <XIcon />
                                  </InputGroupButton>
                                </InputGroupAddon>
                              )}
                            </InputGroup>
                            {field.errors && (
                              <FieldError
                                errors={field.errors.map((message) => ({
                                  message,
                                }))}
                              />
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    </FormischField>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      insert(form, {
                        path: ["emails"],
                        initialInput: { address: "" },
                      })
                    }
                    disabled={fieldArray.items.length >= 5}
                  >
                    Add Email Address
                  </Button>
                </FieldGroup>
                {fieldArray.errors && (
                  <FieldError
                    errors={fieldArray.errors.map((message) => ({ message }))}
                  />
                )}
              </FieldSet>
            )}
          </FieldArray>
        </Form>
      </CardContent>
      <CardFooter className="border-t">
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => reset(form)}>
            Reset
          </Button>
          <Button type="submit" form="form-formisch-array">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
