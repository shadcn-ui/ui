<script setup lang="ts">
import type { StepperRootEmits, StepperRootProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { StepperRoot, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'
import { useResolvedDirection } from '@/lib/rtl'

const props = defineProps<StepperRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<StepperRootEmits>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
const dir = useResolvedDirection(() => props.dir)
</script>

<template>
  <StepperRoot
    v-slot="slotProps"
    v-bind="forwarded"
    :dir="dir"
    :class="cn('flex gap-2 data-[orientation=vertical]:flex-col', props.class)"
  >
    <slot v-bind="slotProps" />
  </StepperRoot>
</template>
