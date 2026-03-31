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

const largeListItems = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`)
</script>

<template>
  <Example title="Large List (100 items)">
    <Combobox :items="largeListItems">
      <ComboboxInput placeholder="Search from 100 items" />
      <ComboboxList>
        <ComboboxViewport>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxItem
            v-for="item in largeListItems"
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
