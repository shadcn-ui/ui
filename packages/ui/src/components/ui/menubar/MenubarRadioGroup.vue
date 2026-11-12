<script setup lang="ts">
import type { MenubarRadioGroupEmits, MenubarRadioGroupProps } from 'radix-vue'
import { MenubarRadioGroup, useForwardPropsEmits } from 'radix-vue'

const props = defineProps<MenubarRadioGroupProps>()

const emits = defineEmits<MenubarRadioGroupEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <MenubarRadioGroup v-bind="forwarded">
    <slot />
  </MenubarRadioGroup>
</template>
