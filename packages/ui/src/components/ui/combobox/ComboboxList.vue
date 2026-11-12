<script setup lang="ts">
import type { ComboboxContentEmits, ComboboxContentProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ComboboxContent, ComboboxPortal, ComboboxViewport, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<ComboboxContentProps & { class?: HTMLAttributes['class'] }>(),
  {
    position: 'popper',
    align: 'center',
    sideOffset: 4,
  },
)
const emits = defineEmits<ComboboxContentEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ComboboxPortal>
    <ComboboxContent
      v-bind="forwarded"
      :class="
        cn(
          'z-50 w-[200px] rounded-md border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          props.class,
        )
      "
    >
      <ComboboxViewport>
        <slot />
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxPortal>
</template>
