<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import { toLatinDigits, toPersianDigits } from '@saaze/utils'
import { cn } from '@/lib/utils'

interface Props {
  type?: string
  /** تبدیل خودکار رقم‌های ورودی به فارسی و پذیرش رقم‌های عربی */
  persianDigits?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  persianDigits: false,
})

const model = defineModel<string | number | undefined>()
const inputRef = ref<HTMLInputElement | null>(null)

const effectiveType = computed(() =>
  props.persianDigits && props.type === 'number' ? 'text' : props.type,
)

function handleInput(event: Event) {
  const input = event.target as HTMLInputElement
  const raw = input.value
  const next = props.persianDigits ? toPersianDigits(toLatinDigits(raw)) : raw

  if (next !== raw) {
    const selectionStart = input.selectionStart
    const selectionEnd = input.selectionEnd
    input.value = next

    if (selectionStart !== null && selectionEnd !== null) {
      input.setSelectionRange(selectionStart, selectionEnd)
    }
  }

  model.value = next
}

defineExpose({ input: inputRef })
</script>

<template>
  <input
    ref="inputRef"
    :type="effectiveType"
    :value="model ?? ''"
    :class="
      cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-start text-sm ring-offset-background',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive',
        props.class,
      )
    "
    @input="handleInput"
  />
</template>
