<script setup lang="ts">
import type { ContextMenuGroupProps } from "reka-ui"
import { ContextMenuGroup } from "reka-ui"

const props = defineProps<ContextMenuGroupProps>()
</script>

<template>
  <ContextMenuGroup
    data-slot="context-menu-group"
    v-bind="props"
  >
    <slot />
  </ContextMenuGroup>
</template>
