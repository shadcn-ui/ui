<script setup lang="ts">
import { ref } from 'vue'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
} from '@/ui/combobox'
import CheckIcon from "@material-symbols/svg-400/rounded/check.svg?component"

const frameworks = [
  'Next.js',
  'SvelteKit',
  'Nuxt.js',
  'Remix',
  'Astro',
]

const value = ref<string>('')
</script>

<template>
  <Combobox v-model="value" :display-value="(v: unknown) => v as string" disabled>
    <ComboboxAnchor class="w-[200px]">
      <ComboboxInput placeholder="Select a framework" />
    </ComboboxAnchor>
    <ComboboxList>
      <ComboboxEmpty>No items found.</ComboboxEmpty>
      <ComboboxGroup>
        <ComboboxItem
          v-for="framework in frameworks"
          :key="framework"
          :value="framework"
        >
          {{ framework }}
          <ComboboxItemIndicator>
            <CheckIcon />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>
