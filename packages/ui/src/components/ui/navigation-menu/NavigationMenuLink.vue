<script setup lang="ts">
import type { NavigationMenuLinkEmits, NavigationMenuLinkProps } from 'radix-vue'
import { NavigationMenuLink, useForwardPropsEmits } from 'radix-vue'

const props = defineProps<NavigationMenuLinkProps>()
const emits = defineEmits<NavigationMenuLinkEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <NavigationMenuLink v-bind="forwarded">
    <slot />
  </NavigationMenuLink>
</template>
