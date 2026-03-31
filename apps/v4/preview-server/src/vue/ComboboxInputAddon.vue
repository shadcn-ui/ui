<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Example } from "@/components"
import {
  Combobox,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxViewport,
} from "@/ui/combobox"
import { InputGroupAddon } from "@/ui/input-group"

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
  <Example title="With Icon Addon">
    <Combobox :items="timezones">
      <ComboboxInput placeholder="Select a timezone">
        <InputGroupAddon>
          <IconPlaceholder
            lucide="GlobeIcon"
            tabler="IconGlobe"
            hugeicons="Globe02Icon"
            phosphor="GlobeIcon"
            remixicon="RiGlobalLine"
          />
        </InputGroupAddon>
      </ComboboxInput>
      <ComboboxList :align-offset="-28" class="w-60">
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
