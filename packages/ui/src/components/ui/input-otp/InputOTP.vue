<script setup lang="ts">
import type { PinInputRootEmits, PinInputRootProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { PinInputRoot, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<PinInputRootProps & { class?: HTMLAttributes['class']; dir?: 'rtl' | 'ltr' }>(),
  { dir: 'ltr', otp: true },
)
const emits = defineEmits<PinInputRootEmits>()
const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class'), emits)
</script>

<template>
  <PinInputRoot v-bind="forwarded" :dir="dir" :class="cn('flex items-center gap-2', props.class)">
    <slot />
  </PinInputRoot>
</template>
