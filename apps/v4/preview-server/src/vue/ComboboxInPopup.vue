<script setup lang="ts">
import { ref } from "vue"
import { Example } from "@/components"
import { Button } from "@/ui/button"
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxViewport,
} from "@/ui/combobox"

const countries = [
  { code: "us", value: "united-states", label: "United States" },
  { code: "gb", value: "united-kingdom", label: "United Kingdom" },
  { code: "ca", value: "canada", label: "Canada" },
  { code: "au", value: "australia", label: "Australia" },
  { code: "de", value: "germany", label: "Germany" },
  { code: "fr", value: "france", label: "France" },
  { code: "jp", value: "japan", label: "Japan" },
  { code: "cn", value: "china", label: "China" },
]

const selectedValue = ref(countries[0])
</script>

<template>
  <Example title="Combobox in Popup">
    <Combobox v-model="selectedValue" :items="countries">
      <ComboboxTrigger :as-child="true">
        <Button
          variant="outline"
          class="w-64 justify-between font-normal"
        >
          {{ selectedValue?.label || 'Select country' }}
        </Button>
      </ComboboxTrigger>
      <ComboboxList>
        <ComboboxInput :show-trigger="false" placeholder="Search" />
        <ComboboxViewport>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxItem
            v-for="item in countries"
            :key="item.code"
            :value="item"
          >
            {{ item.label }}
          </ComboboxItem>
        </ComboboxViewport>
      </ComboboxList>
    </Combobox>
  </Example>
</template>
