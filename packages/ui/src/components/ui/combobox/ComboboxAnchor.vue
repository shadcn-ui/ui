<script setup lang="ts">
import type { ComboboxAnchorProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ComboboxAnchor, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ComboboxAnchorProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <ComboboxAnchor v-bind="forwarded" :class="cn('w-[200px]', props.class)">
    <slot />
  </ComboboxAnchor>
</template>
