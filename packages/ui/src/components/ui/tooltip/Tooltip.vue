<script setup lang="ts">
import type { TooltipRootEmits, TooltipRootProps } from 'radix-vue'
import { TooltipProvider, TooltipRoot, useForwardPropsEmits } from 'radix-vue'

const props = defineProps<TooltipRootProps>()
const emits = defineEmits<TooltipRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <!-- فراهم‌کننده داخلی باعث می‌شود Tooltip بدون TooltipProvider سراسری هم کار کند. -->
  <TooltipProvider>
    <TooltipRoot v-slot="slotProps" v-bind="forwarded">
      <slot v-bind="slotProps" />
    </TooltipRoot>
  </TooltipProvider>
</template>
