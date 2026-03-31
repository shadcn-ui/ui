<script setup lang="ts">
import { Example } from "@/components/example"
import {
  Combobox,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxViewport,
} from "@/ui/combobox"

const timezones = [
  {
    value: "Americas",
    items: [
      "(GMT-5) New York",
      "(GMT-8) Los Angeles",
      "(GMT-6) Chicago",
      "(GMT-5) Toronto",
      "(GMT-8) Vancouver",
      "(GMT-3) São Paulo",
    ],
  },
  {
    value: "Europe",
    items: [
      "(GMT+0) London",
      "(GMT+1) Paris",
      "(GMT+1) Berlin",
      "(GMT+1) Rome",
      "(GMT+1) Madrid",
      "(GMT+1) Amsterdam",
    ],
  },
  {
    value: "Asia/Pacific",
    items: [
      "(GMT+9) Tokyo",
      "(GMT+8) Shanghai",
      "(GMT+8) Singapore",
      "(GMT+4) Dubai",
      "(GMT+11) Sydney",
      "(GMT+9) Seoul",
    ],
  },
]
</script>

<template>
  <Example title="With Groups">
    <Combobox :items="timezones">
      <ComboboxInput placeholder="Select a timezone" />
      <ComboboxList>
        <ComboboxViewport>
          <ComboboxEmpty>No timezones found.</ComboboxEmpty>
          <ComboboxGroup
            v-for="group in timezones"
            :key="group.value"
            :heading="group.value"
          >
            <ComboboxItem
              v-for="item in group.items"
              :key="item"
              :value="item"
            >
              {{ item }}
            </ComboboxItem>
          </ComboboxGroup>
        </ComboboxViewport>
      </ComboboxList>
    </Combobox>
  </Example>
</template>
