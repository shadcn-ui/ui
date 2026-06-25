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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"

const spokenLanguages = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Italian", value: "it" },
  { label: "Chinese", value: "zh" },
  { label: "Japanese", value: "ja" },
] as const

export default function FormInertiaSelect() {
  const form = useForm({
    language: "",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    form.clearErrors()

    if (!form.data.language) {
      form.setError("language", "Please select your spoken language.")
      return
    }
    if (form.data.language === "auto") {
      form.setError(
        "language",
        "Auto-detection is not allowed. Please select a specific language."
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
    <Card className="w-full sm:max-w-lg">
      <CardHeader>
        <CardTitle>Language Preferences</CardTitle>
        <CardDescription>
          Select your preferred spoken language.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-inertia-select" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field
              orientation="responsive"
              data-invalid={!!form.errors.language}
            >
              <FieldContent>
                <FieldLabel htmlFor="form-inertia-select-language">
                  Spoken Language
                </FieldLabel>
                <FieldDescription>
                  For best results, select the language you speak.
                </FieldDescription>
                {form.errors.language && (
                  <FieldError
                    errors={[{ message: form.errors.language }]}
                  />
                )}
              </FieldContent>
              <Select
                name="language"
                value={form.data.language}
                onValueChange={(value) => form.setData("language", value)}
              >
                <SelectTrigger
                  id="form-inertia-select-language"
                  aria-invalid={!!form.errors.language}
                  className="min-w-[120px]"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectSeparator />
                  {spokenLanguages.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          <Button type="submit" form="form-inertia-select">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
