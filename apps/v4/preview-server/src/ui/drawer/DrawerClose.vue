<script lang="ts" setup>
import type { DrawerCloseProps } from "vaul-vue"
import { DrawerClose } from "vaul-vue"

const props = defineProps<DrawerCloseProps>()
</script>

<template>
  <DrawerClose
    data-slot="drawer-close"
    v-bind="props"
  >
    <slot />
  </DrawerClose>
</template>
