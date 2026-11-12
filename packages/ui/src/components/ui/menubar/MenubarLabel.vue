<script setup lang="ts">
import type { MenubarLabelProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { MenubarLabel } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<
  MenubarLabelProps & { class?: HTMLAttributes['class']; inset?: boolean }
>()
</script>

<template>
  <MenubarLabel :class="cn('px-2 py-1.5 text-sm font-semibold', inset && 'ps-8', props.class)">
    <slot />
  </MenubarLabel>
</template>
