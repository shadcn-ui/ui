<script setup lang="ts">
import type { StepperTriggerProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { StepperTrigger, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<StepperTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <StepperTrigger
    v-slot="slotProps"
    v-bind="forwarded"
    :class="
      cn(
        'flex flex-col items-center gap-1 rounded-md p-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
        props.class,
      )
    "
  >
    <slot v-bind="slotProps" />
  </StepperTrigger>
</template>
