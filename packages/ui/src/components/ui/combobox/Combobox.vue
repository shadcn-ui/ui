<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { toLatinDigits } from '@saaze/utils'
import { cn } from '@/lib/utils'
import { useResolvedDirection } from '@/lib/rtl'
import type { ComboboxOption } from './types'
import ComboboxRoot from './ComboboxRoot.vue'
import ComboboxAnchor from './ComboboxAnchor.vue'
import ComboboxInput from './ComboboxInput.vue'
import ComboboxTrigger from './ComboboxTrigger.vue'
import ComboboxList from './ComboboxList.vue'
import ComboboxEmpty from './ComboboxEmpty.vue'
import ComboboxGroup from './ComboboxGroup.vue'
import ComboboxItem from './ComboboxItem.vue'
import { ComboboxItemIndicator } from 'radix-vue'

interface Props {
  options: ComboboxOption[]
  modelValue?: string | string[] | null
  multiple?: boolean
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  dir?: 'ltr' | 'rtl'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  multiple: false,
  placeholder: 'انتخاب کنید',
  searchPlaceholder: 'جستجو...',
  emptyText: 'نتیجه‌ای یافت نشد.',
  disabled: false,
  dir: undefined,
})

const direction = useResolvedDirection(() => props.dir)
const emits = defineEmits<{
  'update:modelValue': [value: string | string[] | null]
}>()

const searchTerm = ref('')

const selectedLabel = computed(() => {
  if (props.multiple) return props.placeholder
  const selected = props.options.find((option) => option.value === props.modelValue)
  return selected?.label ?? props.placeholder
})

const groups = computed(() => {
  const result: Array<{ name: string; options: ComboboxOption[] }> = []
  for (const option of props.options) {
    const name = option.group ?? ''
    let group = result.find((item) => item.name === name)
    if (!group) {
      group = { name, options: [] }
      result.push(group)
    }
    group.options.push(option)
  }
  return result
})

function displayValue(value: any) {
  return props.options.find((option) => option.value === value)?.label ?? String(value)
}

function normalizeSearch(value: string) {
  return toLatinDigits(value)
    .toLocaleLowerCase('fa-IR')
    .replace(/\u064a/g, '\u06cc')
    .replace(/\u0643/g, '\u06a9')
    .trim()
}

function filterOptions(values: any[], term: string) {
  const search = normalizeSearch(term)
  if (!search) return values
  return values.filter((value) => normalizeSearch(displayValue(value)).includes(search))
}

function onValueChange(value: any) {
  emits('update:modelValue', value as string | string[] | null)
}
</script>

<template>
  <ComboboxRoot
    :model-value="modelValue ?? undefined"
    :multiple="multiple"
    :disabled="disabled"
    :display-value="displayValue"
    :filter-function="filterOptions"
    :dir="direction"
    :class="cn('w-full', props.class)"
    @update:model-value="onValueChange"
    @update:search-term="searchTerm = $event"
  >
    <ComboboxAnchor class="w-full">
      <div class="relative">
        <ComboboxInput
          aria-label="جستجوی گزینه‌ها"
          :placeholder="searchPlaceholder"
          :class="
            cn(
              'h-10 w-full rounded-md border border-input bg-background px-3 py-2 pe-9 text-sm shadow-sm',
              'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )
          "
        />
        <ComboboxTrigger
          aria-label="باز کردن فهرست"
          class="absolute end-2 top-1/2 -translate-y-1/2 rounded-sm opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronsUpDown class="size-4" aria-hidden="true" />
          <span class="sr-only">{{ selectedLabel }}</span>
        </ComboboxTrigger>
      </div>
    </ComboboxAnchor>

    <ComboboxList
      class="w-[var(--radix-combobox-trigger-width)] min-w-[12rem] p-1"
      :class="searchTerm ? 'max-h-72' : undefined"
    >
      <ComboboxEmpty>{{ emptyText }}</ComboboxEmpty>
      <ComboboxGroup v-for="group in groups" :key="group.name" :heading="group.name || undefined">
        <ComboboxItem
          v-for="option in group.options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          <span class="truncate">{{ option.label }}</span>
          <ComboboxItemIndicator>
            <Check class="size-4" />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </ComboboxRoot>
</template>
