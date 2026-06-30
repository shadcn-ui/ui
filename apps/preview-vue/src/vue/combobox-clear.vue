<script setup lang="ts">
import { ref } from 'vue'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxCancel,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
} from '@/ui/combobox'
import CheckIcon from "@material-symbols/svg-400/rounded/check.svg?component"
import CloseIcon from "@material-symbols/svg-400/rounded/close.svg?component"

const frameworks = [
  'Next.js',
  'SvelteKit',
  'Nuxt.js',
  'Remix',
  'Astro',
]

const value = ref<string>(frameworks[0])
</script>

<template>
  <Combobox v-model="value" :display-value="(v: unknown) => v as string" reset-model-value-on-clear>
    <ComboboxAnchor class="w-[200px]">
      <ComboboxInput placeholder="Select a framework" />
      <ComboboxCancel v-if="value" class="ml-auto mr-1 size-4 cursor-pointer opacity-50 hover:opacity-100">
        <CloseIcon />
      </ComboboxCancel>
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
