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

const categories = [
  { value: 'technology', label: 'التكنولوجيا' },
  { value: 'design', label: 'التصميم' },
  { value: 'business', label: 'الأعمال' },
  { value: 'marketing', label: 'التسويق' },
  { value: 'education', label: 'التعليم' },
  { value: 'health', label: 'الصحة' },
]

const value = ref<string[]>(['technology'])
</script>

<template>
  <div dir="rtl" class="mx-auto w-full max-w-xs">
    <label class="mb-1.5 block text-sm font-medium">الفئات</label>
    <Combobox v-model="value" multiple :display-value="(v: unknown) => v as string">
      <ComboboxAnchor class="w-full">
        <ComboboxInput placeholder="أضف فئات" />
      </ComboboxAnchor>
      <ComboboxList>
        <ComboboxEmpty>لم يتم العثور على فئات.</ComboboxEmpty>
        <ComboboxGroup>
          <ComboboxItem
            v-for="category in categories"
            :key="category.value"
            :value="category.value"
          >
            {{ category.label }}
            <ComboboxItemIndicator>
              <CheckIcon />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxList>
    </Combobox>
  </div>
</template>
