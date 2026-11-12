<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { toLatinDigits, toPersianDigits } from '@saaze/utils'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
  /** تبدیل خودکار رقم‌های ورودی به فارسی */
  persianDigits?: boolean
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  persianDigits: false,
  rows: 3,
})

const model = defineModel<string | number | undefined>()

function handleInput(event: Event) {
  const textarea = event.target as HTMLTextAreaElement
  const raw = textarea.value
  const next = props.persianDigits ? toPersianDigits(toLatinDigits(raw)) : raw

  if (next !== raw) {
    const selectionStart = textarea.selectionStart
    const selectionEnd = textarea.selectionEnd
    textarea.value = next
    textarea.setSelectionRange(selectionStart, selectionEnd)
  }

  model.value = next
}
</script>

<template>
  <textarea
    :value="model ?? ''"
    :rows="rows"
    :class="
      cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm',
        'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive',
        props.class,
      )
    "
    @input="handleInput"
  />
</template>
