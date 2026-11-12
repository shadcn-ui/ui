<script setup lang="ts">
import type { PinInputInputProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { PinInputInput, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<PinInputInputProps & { class?: HTMLAttributes['class'] }>()
const forwarded = useForwardProps(props)
</script>

<template>
  <PinInputInput
    v-bind="forwarded"
    :class="
      cn(
        'relative flex size-10 items-center justify-center border-y border-e border-solid border-input bg-background text-center text-sm transition-all first:rounded-s-md first:border-s last:rounded-e-md',
        'focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    "
  />
</template>
