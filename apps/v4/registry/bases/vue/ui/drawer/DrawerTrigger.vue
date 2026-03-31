<script lang="ts" setup>
import type { DrawerTriggerProps } from "vaul-vue"
import { DrawerTrigger } from "vaul-vue"

const props = defineProps<DrawerTriggerProps>()
</script>

<template>
  <DrawerTrigger
    data-slot="drawer-trigger"
    v-bind="props"
  >
    <slot />
  </DrawerTrigger>
</template>
