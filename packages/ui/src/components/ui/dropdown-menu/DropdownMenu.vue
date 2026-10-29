<script setup lang="ts">
import { computed, provide } from 'vue'
import {
  DropdownMenuRoot,
  type DropdownMenuRootEmits,
  type DropdownMenuRootProps,
  useForwardPropsEmits,
} from 'radix-vue'
import { dropdownDirectionKey } from '@/lib/rtl'

const props = withDefaults(defineProps<DropdownMenuRootProps>(), {
  dir: 'rtl',
})
const emits = defineEmits<DropdownMenuRootEmits>()
const forwarded = useForwardPropsEmits(props, emits)

provide(
  dropdownDirectionKey,
  computed(() => props.dir ?? 'rtl'),
)
</script>

<template>
  <DropdownMenuRoot v-bind="forwarded">
    <slot />
  </DropdownMenuRoot>
</template>
