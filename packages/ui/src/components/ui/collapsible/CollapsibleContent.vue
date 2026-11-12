<script setup lang="ts">
import type { CollapsibleContentProps } from 'radix-vue'
import { CollapsibleContent } from 'radix-vue'

const props = defineProps<CollapsibleContentProps>()
</script>

<template>
  <CollapsibleContent
    v-bind="props"
    class="overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
  >
    <slot />
  </CollapsibleContent>
</template>
