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
  ComboboxSeparator,
} from '@/ui/combobox'
import { InputGroup, InputGroupAddon } from '@/ui/input-group'
import CheckIcon from "@material-symbols/svg-400/rounded/check.svg?component"
import GlobeIcon from "@material-symbols/svg-400/rounded/globe.svg?component"

const timezones = [
  {
    label: 'Americas',
    items: [
      '(GMT-5) New York',
      '(GMT-8) Los Angeles',
      '(GMT-6) Chicago',
      '(GMT-5) Toronto',
      '(GMT-8) Vancouver',
      '(GMT-3) São Paulo',
    ],
  },
  {
    label: 'Europe',
    items: [
      '(GMT+0) London',
      '(GMT+1) Paris',
      '(GMT+1) Berlin',
      '(GMT+1) Rome',
      '(GMT+1) Madrid',
      '(GMT+1) Amsterdam',
    ],
  },
  {
    label: 'Asia/Pacific',
    items: [
      '(GMT+9) Tokyo',
      '(GMT+8) Shanghai',
      '(GMT+8) Singapore',
      '(GMT+4) Dubai',
      '(GMT+11) Sydney',
      '(GMT+9) Seoul',
    ],
  },
]

const value = ref<string>('')
</script>

<template>
  <Combobox v-model="value" :display-value="(v: unknown) => v as string">
    <ComboboxAnchor class="w-60">
      <InputGroup>
        <InputGroupAddon>
          <GlobeIcon class="size-4" />
        </InputGroupAddon>
        <ComboboxInput placeholder="Select a timezone" class="rounded-s-none border-s-0" />
      </InputGroup>
    </ComboboxAnchor>
    <ComboboxList class="w-60">
      <ComboboxEmpty>No timezones found.</ComboboxEmpty>
      <template v-for="(group, index) in timezones" :key="group.label">
        <ComboboxGroup :heading="group.label">
          <ComboboxItem
            v-for="item in group.items"
            :key="item"
            :value="item"
          >
            {{ item }}
            <ComboboxItemIndicator>
              <CheckIcon />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxGroup>
        <ComboboxSeparator v-if="index < timezones.length - 1" />
      </template>
    </ComboboxList>
  </Combobox>
</template>
