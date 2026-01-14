import * as React from "react"
import { Button } from "@/examples/radix/ui/button"
import { Card, CardContent, CardFooter } from "@/examples/radix/ui/card"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/examples/radix/ui/combobox"
import { Field, FieldGroup, FieldLabel } from "@/examples/radix/ui/field"
import { Select } from "@/examples/radix/ui/select"
import { toast } from "sonner"

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const

export function ComboboxWithForm() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const framework = formData.get("framework") as string
    toast(`You selected ${framework} as your framework.`)
  }

  return (
    <Card className="w-full max-w-sm" size="sm">
      <CardContent>
        <form
          id="form-with-combobox"
          className="w-full"
          onSubmit={handleSubmit}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="framework">Framework</FieldLabel>
              <Combobox items={frameworks}>
                <ComboboxInput
                  id="framework"
                  name="framework"
                  placeholder="Select a framework"
                  required
                />
                <ComboboxContent>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="form-with-combobox">
          Submit
        </Button>
      </CardFooter>
    </Card>
  )
}
