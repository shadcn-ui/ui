<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  DropdownMenuSubContent,
  type DropdownMenuSubContentEmits,
  type DropdownMenuSubContentProps,
  useForwardPropsEmits,
} from 'radix-vue'
import { cn } from '@/lib/utils'
import { dropdownMenuContentClasses } from './styles'

const props = defineProps<DropdownMenuSubContentProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<DropdownMenuSubContentEmits>()
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DropdownMenuSubContent v-bind="forwarded" :class="cn(dropdownMenuContentClasses, props.class)">
    <slot />
  </DropdownMenuSubContent>
</template>
