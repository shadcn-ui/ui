<script setup lang="ts">
import type { MenubarGroupProps } from 'radix-vue'
import { MenubarGroup } from 'radix-vue'

const props = defineProps<MenubarGroupProps>()
</script>

<template>
  <MenubarGroup v-bind="props">
    <slot />
  </MenubarGroup>
</template>
