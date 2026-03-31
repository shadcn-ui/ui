<script setup lang="ts">
import { Example } from "@/components/example"
import {
  Combobox,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
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
  <Example title="With Groups and Separator">
    <Combobox :items="timezones">
      <ComboboxInput placeholder="Select a timezone" />
      <ComboboxList>
        <ComboboxViewport>
          <ComboboxEmpty>No timezones found.</ComboboxEmpty>
          <template
            v-for="(group, index) in timezones"
            :key="group.value"
          >
            <ComboboxGroup :heading="group.value">
              <ComboboxItem
                v-for="item in group.items"
                :key="item"
                :value="item"
              >
                {{ item }}
              </ComboboxItem>
            </ComboboxGroup>
            <ComboboxSeparator v-if="index < timezones.length - 1" />
          </template>
        </ComboboxViewport>
      </ComboboxList>
    </Combobox>
  </Example>
</template>
