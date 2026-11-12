<script setup lang="ts">
import type { StepperSeparatorProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { StepperSeparator, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<StepperSeparatorProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <StepperSeparator
    v-bind="forwarded"
    :class="
      cn(
        'h-0.5 min-w-8 flex-1 shrink-0 rounded-full bg-muted group-data-[disabled]:opacity-50 group-data-[state=completed]:bg-primary data-[orientation=vertical]:h-8 data-[orientation=vertical]:w-0.5 data-[orientation=vertical]:min-w-0',
        props.class,
      )
    "
  >
  </StepperSeparator>
</template>
