<script setup lang="ts">
import type { StepperDescriptionProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { StepperDescription, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<StepperDescriptionProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <StepperDescription v-bind="forwarded" :class="cn('text-xs text-muted-foreground', props.class)">
    <slot />
  </StepperDescription>
</template>
