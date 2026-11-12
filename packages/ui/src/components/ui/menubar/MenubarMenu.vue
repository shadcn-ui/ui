<script setup lang="ts">
import type { MenubarMenuProps } from 'radix-vue'
import { MenubarMenu } from 'radix-vue'

const props = defineProps<MenubarMenuProps>()
</script>

<template>
  <MenubarMenu v-bind="props">
    <slot />
  </MenubarMenu>
</template>
