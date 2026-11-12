<script setup lang="ts">
import type { StepperTitleProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { StepperTitle, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<StepperTitleProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <StepperTitle
    v-bind="forwarded"
    :class="cn('whitespace-nowrap text-sm font-semibold', props.class)"
  >
    <slot />
  </StepperTitle>
</template>
