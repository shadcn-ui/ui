<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import { formatJalali } from '@saaze/utils'
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'radix-vue'
import { CalendarDays, X } from 'lucide-vue-next'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { resolveLogicalAlign, type LogicalAlign, useResolvedDirection } from '@/lib/rtl'

interface Props {
  modelValue?: Date | null
  defaultMonth?: Date | null
  minDate?: Date | null
  maxDate?: Date | null
  placeholder?: string
  displayFormat?: string
  disabled?: boolean
  clearable?: boolean
  id?: string
  ariaLabel?: string
  dir?: 'rtl' | 'ltr'
  align?: LogicalAlign
  side?: 'top' | 'right' | 'bottom' | 'left'
  weekStartsOn?: number
  showOutsideDays?: boolean
  showToday?: boolean
  isDateDisabled?: (date: Date) => boolean
  class?: HTMLAttributes['class']
  popoverClass?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  defaultMonth: null,
  minDate: null,
  maxDate: null,
  placeholder: 'انتخاب تاریخ',
  displayFormat: 'YYYY/MM/DD',
  disabled: false,
  clearable: true,
  id: undefined,
  ariaLabel: undefined,
  dir: undefined,
  align: 'start',
  side: 'bottom',
  weekStartsOn: 6,
  showOutsideDays: true,
  showToday: true,
  isDateDisabled: undefined,
  class: undefined,
  popoverClass: undefined,
})

const direction = useResolvedDirection(() => props.dir)
const emits = defineEmits<{
  'update:modelValue': [value: Date | null]
  change: [value: Date | null]
}>()

const open = ref(false)
const isValidDate = (value?: Date | null): value is Date =>
  value instanceof Date && !Number.isNaN(value.getTime())

const displayValue = computed(() =>
  isValidDate(props.modelValue)
    ? formatJalali(props.modelValue, { pattern: props.displayFormat })
    : '',
)
const physicalAlign = computed(() => resolveLogicalAlign(props.align, direction.value))

function handleSelect(value: Date) {
  emits('update:modelValue', value)
  emits('change', value)
  open.value = false
}

function clearDate() {
  if (props.disabled) return
  emits('update:modelValue', null)
  emits('change', null)
  open.value = false
}

defineExpose({ open })
</script>

<template>
  <PopoverRoot v-model:open="open">
    <div :dir="direction" :class="cn('relative', props.class)">
      <PopoverTrigger as-child>
        <button
          :id="id"
          type="button"
          :disabled="disabled"
          :aria-label="ariaLabel ?? placeholder"
          :class="
            cn(
              'flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-start text-sm ring-offset-background transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'data-[state=open]:border-ring',
              clearable && isValidDate(modelValue) ? 'pe-16' : 'pe-9',
            )
          "
        >
          <span :class="cn('truncate', !displayValue && 'text-muted-foreground')">
            {{ displayValue || placeholder }}
          </span>
        </button>
      </PopoverTrigger>

      <button
        v-if="clearable && isValidDate(modelValue)"
        type="button"
        :disabled="disabled"
        aria-label="پاک کردن تاریخ"
        class="absolute end-8 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none"
        @click.stop="clearDate"
      >
        <X class="size-3.5" aria-hidden="true" />
      </button>

      <CalendarDays
        class="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />

      <PopoverPortal>
        <PopoverContent
          :dir="direction"
          :align="physicalAlign"
          :side="side"
          :side-offset="6"
          :class="
            cn(
              'z-50 w-auto rounded-lg border bg-popover p-0 text-popover-foreground shadow-md outline-none',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
              'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
              props.popoverClass,
            )
          "
        >
          <Calendar
            :model-value="modelValue"
            :default-month="defaultMonth"
            :min-date="minDate"
            :max-date="maxDate"
            :dir="direction"
            :week-starts-on="weekStartsOn"
            :show-outside-days="showOutsideDays"
            :show-today="showToday"
            :is-date-disabled="isDateDisabled"
            @select="handleSelect"
          />
        </PopoverContent>
      </PopoverPortal>
    </div>
  </PopoverRoot>
</template>
