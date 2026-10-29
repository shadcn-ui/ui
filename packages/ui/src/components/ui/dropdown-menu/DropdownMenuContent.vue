<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import {
  DropdownMenuContent,
  type DropdownMenuContentEmits,
  type DropdownMenuContentProps,
  DropdownMenuPortal,
  useForwardPropsEmits,
} from 'radix-vue'
import { cn } from '@/lib/utils'
import { resolveLogicalAlign, useDropdownDirection } from '@/lib/rtl'
import { dropdownMenuContentClasses } from './styles'

const props = withDefaults(
  defineProps<DropdownMenuContentProps & { class?: HTMLAttributes['class'] }>(),
  {
    sideOffset: 4,
    side: 'bottom',
    align: 'start',
  },
)
const emits = defineEmits<DropdownMenuContentEmits>()
const forwarded = useForwardPropsEmits(props, emits)
const direction = useDropdownDirection()
const physicalAlign = computed(() => resolveLogicalAlign(props.align, direction.value))
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent
      v-bind="forwarded"
      :align="physicalAlign"
      :class="cn(dropdownMenuContentClasses, props.class)"
    >
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
