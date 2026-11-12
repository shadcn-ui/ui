<script setup lang="ts">
import type { SelectScrollUpButtonProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ChevronUp } from 'lucide-vue-next'
import { SelectScrollUpButton, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<SelectScrollUpButtonProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <SelectScrollUpButton
    v-bind="forwardedProps"
    :class="cn('flex cursor-default items-center justify-center py-1', props.class)"
  >
    <slot>
      <ChevronUp />
    </slot>
  </SelectScrollUpButton>
</template>
