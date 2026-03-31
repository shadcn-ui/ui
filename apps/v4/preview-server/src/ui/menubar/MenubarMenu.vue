<script setup lang="ts">
import type { MenubarMenuProps } from "reka-ui"
import { MenubarMenu } from "reka-ui"

const props = defineProps<MenubarMenuProps>()
</script>

<template>
  <MenubarMenu
    data-slot="menubar-menu"
    v-bind="props"
  >
    <slot />
  </MenubarMenu>
</template>
