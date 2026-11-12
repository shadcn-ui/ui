<script setup lang="ts">
import type { ComboboxTriggerProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ComboboxTrigger, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ComboboxTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <ComboboxTrigger v-bind="forwarded" :class="cn('', props.class)" tabindex="0">
    <slot />
  </ComboboxTrigger>
</template>
