<script setup lang="ts">
import type { ContextMenuSubEmits, ContextMenuSubProps } from "reka-ui"
import {
  ContextMenuSub,
  useForwardPropsEmits,
} from "reka-ui"

const props = defineProps<ContextMenuSubProps>()
const emits = defineEmits<ContextMenuSubEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <ContextMenuSub
    data-slot="context-menu-sub"
    v-bind="forwarded"
  >
    <slot />
  </ContextMenuSub>
</template>
