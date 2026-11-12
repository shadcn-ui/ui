<script setup lang="ts">
import type { NumberFieldDecrementProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { Minus } from 'lucide-vue-next'
import { NumberFieldDecrement, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<NumberFieldDecrementProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <NumberFieldDecrement
    data-slot="decrement"
    aria-label="کاهش"
    v-bind="forwarded"
    :class="
      cn(
        'absolute start-0 top-1/2 flex h-full -translate-y-1/2 items-center px-3 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30',
        props.class,
      )
    "
  >
    <slot>
      <Minus class="size-4" aria-hidden="true" />
    </slot>
  </NumberFieldDecrement>
</template>
