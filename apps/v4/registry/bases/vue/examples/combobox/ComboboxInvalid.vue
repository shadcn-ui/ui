<script setup lang="ts">
import { Example } from "@/components/example"
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
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/ui/field"

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
]
</script>

<template>
  <Example title="Invalid">
    <div class="flex flex-col gap-4">
      <Combobox :items="frameworks">
        <ComboboxInput
          placeholder="Select a framework"
          :aria-invalid="true"
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
      <Field data-invalid>
        <FieldLabel html-for="combobox-framework-invalid">
          Framework
        </FieldLabel>
        <Combobox :items="frameworks">
          <ComboboxInput
            id="combobox-framework-invalid"
            placeholder="Select a framework"
            :aria-invalid="true"
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
        <FieldDescription>Please select a valid framework.</FieldDescription>
        <FieldError :errors="[{ message: 'This field is required.' }]" />
      </Field>
    </div>
  </Example>
</template>
