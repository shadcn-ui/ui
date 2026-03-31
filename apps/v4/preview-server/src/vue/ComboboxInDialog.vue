<script setup lang="ts">
import { ref } from "vue"
import { toast } from "vue-sonner"
import { Example } from "@/components"
import { Button } from "@/ui/button"
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxViewport,
} from "@/ui/combobox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog"
import {
  Field,
  FieldLabel,
} from "@/ui/field"

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
]

const open = ref(false)
</script>

<template>
  <Example title="Combobox in Dialog">
    <Dialog v-model:open="open" :modal="false">
      <DialogTrigger :as-child="true">
        <Button variant="outline">
          Open Dialog
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Framework</DialogTitle>
          <DialogDescription>
            Choose your preferred framework from the list below.
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel html-for="framework-dialog" class="sr-only">
            Framework
          </FieldLabel>
          <Combobox :items="frameworks">
            <ComboboxInput
              id="framework-dialog"
              placeholder="Select a framework"
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
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            @click="open = false"
          >
            Cancel
          </Button>
          <Button
            type="button"
            @click="() => {
              toast('Framework selected.')
              open = false
            }"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Example>
</template>
