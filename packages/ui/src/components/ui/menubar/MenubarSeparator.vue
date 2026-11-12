<script setup lang="ts">
import type { MenubarSeparatorProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { MenubarSeparator, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<MenubarSeparatorProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <MenubarSeparator :class="cn('-mx-1 my-1 h-px bg-muted', props.class)" v-bind="forwardedProps" />
</template>
