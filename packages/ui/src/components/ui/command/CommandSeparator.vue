<script setup lang="ts">
import type { SeparatorProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { Separator } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<SeparatorProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <Separator v-bind="delegatedProps" :class="cn('-mx-1 h-px bg-border', props.class)">
    <slot />
  </Separator>
</template>
