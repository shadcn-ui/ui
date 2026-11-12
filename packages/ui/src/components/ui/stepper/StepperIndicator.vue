<script setup lang="ts">
import type { StepperIndicatorProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { StepperIndicator, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<StepperIndicatorProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <StepperIndicator
    v-slot="slotProps"
    v-bind="forwarded"
    :class="
      cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-muted text-sm font-medium text-muted-foreground transition-colors group-data-[disabled]:opacity-50 group-data-[state=active]:border-primary group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground group-data-[state=completed]:border-primary group-data-[state=completed]:bg-primary/15 group-data-[state=completed]:text-primary',
        props.class,
      )
    "
  >
    <slot v-bind="slotProps" />
  </StepperIndicator>
</template>
