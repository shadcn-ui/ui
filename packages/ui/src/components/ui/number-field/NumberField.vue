<script setup lang="ts">
import type { NumberFieldRootEmits, NumberFieldRootProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { NumberFieldRoot, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'

/** پیش‌فرض `locale` فارسی است تا عددها با رقم فارسی نمایش داده و تجزیه شوند. */
const props = withDefaults(
  defineProps<NumberFieldRootProps & { class?: HTMLAttributes['class'] }>(),
  { locale: 'fa-IR' },
)
const emits = defineEmits<NumberFieldRootEmits>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <NumberFieldRoot v-bind="forwarded" :class="cn('grid gap-1.5', props.class)">
    <slot />
  </NumberFieldRoot>
</template>
