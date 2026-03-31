<script setup lang="ts">
import { Example } from "@/components"
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxViewport,
} from "@/ui/combobox"

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
]
</script>

<template>
  <Example title="With Clear Button">
    <Combobox
      :items="frameworks"
      :default-value="frameworks[0]"
    >
      <ComboboxInput
        placeholder="Select a framework"
        :show-clear="true"
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
  </Example>
</template>
