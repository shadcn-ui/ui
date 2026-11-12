<script setup lang="ts">
import type { ContextMenuCheckboxItemEmits, ContextMenuCheckboxItemProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { ContextMenuCheckboxItem, ContextMenuItemIndicator, useForwardPropsEmits } from 'radix-vue'
import { Check } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps<ContextMenuCheckboxItemProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<ContextMenuCheckboxItemEmits>()
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <ContextMenuCheckboxItem v-bind="forwarded" :class="cn('relative flex cursor-default select-none items-center rounded-sm py-1.5 pe-2 ps-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', props.class)">
    <span class="absolute start-2 flex size-3.5 items-center justify-center">
      <ContextMenuItemIndicator><Check class="size-4" /></ContextMenuItemIndicator>
    </span>
    <slot />
  </ContextMenuCheckboxItem>
</template>
