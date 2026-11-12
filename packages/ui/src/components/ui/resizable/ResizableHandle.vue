<script setup lang="ts">
import type { SplitterResizeHandleEmits, SplitterResizeHandleProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { SplitterResizeHandle, useForwardPropsEmits } from 'radix-vue'
import { GripVertical } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<SplitterResizeHandleProps & { class?: HTMLAttributes['class']; orientation?: 'vertical' | 'horizontal'; withHandle?: boolean }>(),
  { orientation: 'vertical', withHandle: false },
)
const emits = defineEmits<SplitterResizeHandleEmits>()
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <SplitterResizeHandle
    v-bind="forwarded"
    :class="
      cn(
        'relative flex shrink-0 items-center justify-center bg-border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1',
        orientation === 'vertical' ? 'w-px cursor-col-resize' : 'h-px cursor-row-resize',
        'after:absolute after:inset-0 after:z-10',
        props.class,
      )
    "
  >
    <span v-if="withHandle" class="z-20 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
      <GripVertical class="size-2.5" aria-hidden="true" />
    </span>
    <slot v-else />
  </SplitterResizeHandle>
</template>
