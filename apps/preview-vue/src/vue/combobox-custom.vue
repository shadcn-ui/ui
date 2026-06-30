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

type Country = {
  code: string
  value: string
  label: string
  continent: string
}

const countries: Country[] = [
  { code: 'ar', value: 'argentina', label: 'Argentina', continent: 'South America' },
  { code: 'au', value: 'australia', label: 'Australia', continent: 'Oceania' },
  { code: 'br', value: 'brazil', label: 'Brazil', continent: 'South America' },
  { code: 'ca', value: 'canada', label: 'Canada', continent: 'North America' },
  { code: 'cn', value: 'china', label: 'China', continent: 'Asia' },
  { code: 'co', value: 'colombia', label: 'Colombia', continent: 'South America' },
  { code: 'eg', value: 'egypt', label: 'Egypt', continent: 'Africa' },
  { code: 'fr', value: 'france', label: 'France', continent: 'Europe' },
  { code: 'de', value: 'germany', label: 'Germany', continent: 'Europe' },
  { code: 'it', value: 'italy', label: 'Italy', continent: 'Europe' },
  { code: 'jp', value: 'japan', label: 'Japan', continent: 'Asia' },
  { code: 'ke', value: 'kenya', label: 'Kenya', continent: 'Africa' },
  { code: 'mx', value: 'mexico', label: 'Mexico', continent: 'North America' },
  { code: 'nz', value: 'new-zealand', label: 'New Zealand', continent: 'Oceania' },
  { code: 'ng', value: 'nigeria', label: 'Nigeria', continent: 'Africa' },
  { code: 'za', value: 'south-africa', label: 'South Africa', continent: 'Africa' },
  { code: 'kr', value: 'south-korea', label: 'South Korea', continent: 'Asia' },
  { code: 'gb', value: 'united-kingdom', label: 'United Kingdom', continent: 'Europe' },
  { code: 'us', value: 'united-states', label: 'United States', continent: 'North America' },
]

const value = ref<Country | null>(null)
</script>

<template>
  <Combobox
    v-model="value"
    :display-value="(v: unknown) => (v as Country)?.label ?? ''"
    :filter-function="(items: unknown, search: string) => (items as Country[]).filter(i => i.label.toLowerCase().includes(search.toLowerCase()))"
  >
    <ComboboxAnchor class="w-[220px]">
      <ComboboxInput placeholder="Search countries..." />
    </ComboboxAnchor>
    <ComboboxList>
      <ComboboxEmpty>No countries found.</ComboboxEmpty>
      <ComboboxGroup>
        <ComboboxItem
          v-for="country in countries"
          :key="country.code"
          :value="country"
        >
          <div>
            <p class="text-sm font-medium">{{ country.label }}</p>
            <p class="text-muted-foreground text-xs">{{ country.continent }} ({{ country.code }})</p>
          </div>
          <ComboboxItemIndicator>
            <CheckIcon />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>
