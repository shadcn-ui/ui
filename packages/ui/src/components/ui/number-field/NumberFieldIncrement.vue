<script setup lang="ts">
import type { NumberFieldIncrementProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { Plus } from 'lucide-vue-next'
import { NumberFieldIncrement, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<NumberFieldIncrementProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <NumberFieldIncrement
    data-slot="increment"
    aria-label="افزایش"
    v-bind="forwarded"
    :class="
      cn(
        'absolute end-0 top-1/2 flex h-full -translate-y-1/2 items-center px-3 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30',
        props.class,
      )
    "
  >
    <slot>
      <Plus class="size-4" aria-hidden="true" />
    </slot>
  </NumberFieldIncrement>
</template>
