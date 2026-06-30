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
  ComboboxTrigger,
} from '@/ui/combobox'
import { Button } from '@/ui/button'
import CheckIcon from "@material-symbols/svg-400/rounded/check.svg?component"
import UnfoldMoreIcon from "@material-symbols/svg-400/rounded/unfold_more.svg?component"

type Country = {
  code: string
  value: string
  label: string
  continent: string
}

const countries: Country[] = [
  { code: '', value: '', label: 'Select country', continent: '' },
  { code: 'ar', value: 'argentina', label: 'Argentina', continent: 'South America' },
  { code: 'au', value: 'australia', label: 'Australia', continent: 'Oceania' },
  { code: 'br', value: 'brazil', label: 'Brazil', continent: 'South America' },
  { code: 'ca', value: 'canada', label: 'Canada', continent: 'North America' },
  { code: 'cn', value: 'china', label: 'China', continent: 'Asia' },
  { code: 'eg', value: 'egypt', label: 'Egypt', continent: 'Africa' },
  { code: 'fr', value: 'france', label: 'France', continent: 'Europe' },
  { code: 'de', value: 'germany', label: 'Germany', continent: 'Europe' },
  { code: 'jp', value: 'japan', label: 'Japan', continent: 'Asia' },
  { code: 'mx', value: 'mexico', label: 'Mexico', continent: 'North America' },
  { code: 'gb', value: 'united-kingdom', label: 'United Kingdom', continent: 'Europe' },
  { code: 'us', value: 'united-states', label: 'United States', continent: 'North America' },
]

const value = ref<Country>(countries[0])
</script>

<template>
  <Combobox
    v-model="value"
    :display-value="(v: unknown) => (v as Country)?.label ?? ''"
    :filter-function="(items: unknown, search: string) => (items as Country[]).filter(i => i.label.toLowerCase().includes(search.toLowerCase()))"
  >
    <ComboboxAnchor class="w-64">
      <ComboboxTrigger as-child>
        <Button variant="outline" class="w-64 justify-between font-normal">
          {{ value?.label || 'Select country' }}
          <UnfoldMoreIcon class="opacity-50" />
        </Button>
      </ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxList>
      <ComboboxInput placeholder="Search" class="border-b p-2" />
      <ComboboxEmpty>No items found.</ComboboxEmpty>
      <ComboboxGroup>
        <ComboboxItem
          v-for="country in countries"
          :key="country.code"
          :value="country"
        >
          {{ country.label }}
          <ComboboxItemIndicator>
            <CheckIcon />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>
