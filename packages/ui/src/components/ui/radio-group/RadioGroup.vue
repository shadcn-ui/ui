<script setup lang="ts">
import type { RadioGroupRootEmits, RadioGroupRootProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { RadioGroupRoot, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'
import { useResolvedDirection } from '@/lib/rtl'

const props = withDefaults(
  defineProps<RadioGroupRootProps & { class?: HTMLAttributes['class'] }>(),
  {
    loop: true,
  },
)
const emits = defineEmits<RadioGroupRootEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
const dir = useResolvedDirection(() => props.dir)
</script>

<template>
  <RadioGroupRoot v-bind="forwarded" :dir="dir" :class="cn('grid gap-2', props.class)">
    <slot />
  </RadioGroupRoot>
</template>
