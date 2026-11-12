<script setup lang="ts">
import type { AccordionItemProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { AccordionItem, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<AccordionItemProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <AccordionItem v-bind="forwardedProps" :class="cn('border-b', props.class)">
    <slot />
  </AccordionItem>
</template>
