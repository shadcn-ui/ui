<script setup lang="ts">
import type { ComboboxSeparatorProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ComboboxSeparator } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ComboboxSeparatorProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <ComboboxSeparator v-bind="delegatedProps" :class="cn('-mx-1 h-px bg-border', props.class)">
    <slot />
  </ComboboxSeparator>
</template>
