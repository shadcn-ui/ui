<script setup lang="ts">
import { toast } from "vue-sonner"
import { Example } from "@/components"
import { Button } from "@/ui/button"
import { Card, CardContent, CardFooter } from "@/ui/card"
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxViewport,
} from "@/ui/combobox"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/ui/field"

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
]

function handleSubmit(event: Event) {
  event.preventDefault()
  const formData = new FormData(event.target as HTMLFormElement)
  const framework = formData.get("framework") as string
  toast(`You selected ${framework} as your framework.`)
}
</script>

<template>
  <Example title="Form with Combobox">
    <Card class="w-full max-w-sm" size="sm">
      <CardContent>
        <form
          id="form-with-combobox"
          class="w-full"
          @submit="handleSubmit"
        >
          <FieldGroup>
            <Field>
              <FieldLabel html-for="framework">
                Framework
              </FieldLabel>
              <Combobox :items="frameworks">
                <ComboboxInput
                  id="framework"
                  name="framework"
                  placeholder="Select a framework"
                  required
                />
                <ComboboxList>
                  <ComboboxViewport>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxItem
                      v-for="item in frameworks"
                      :key="item"
                      :value="item"
                    >
                      {{ item }}
                    </ComboboxItem>
                  </ComboboxViewport>
                </ComboboxList>
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
  </Example>
</template>
