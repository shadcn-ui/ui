<script setup lang="ts">
import type { ContextMenuContentEmits, ContextMenuContentProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ContextMenuContent, ContextMenuPortal, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<ContextMenuContentProps & { class?: HTMLAttributes['class'] }>(),
  { collisionPadding: 8 },
)
const emits = defineEmits<ContextMenuContentEmits>()
const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <ContextMenuPortal>
    <ContextMenuContent
      v-bind="forwarded"
      :class="
        cn(
          'z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          props.class,
        )
      "
    >
      <slot />
    </ContextMenuContent>
  </ContextMenuPortal>
</template>
