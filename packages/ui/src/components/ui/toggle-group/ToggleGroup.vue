<script setup lang="ts">
import type { VariantProps } from 'class-variance-authority'
import type { ToggleGroupRootEmits, ToggleGroupRootProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import type { toggleVariants } from '@/components/ui/toggle'
import { reactiveOmit } from '@vueuse/core'
import { ToggleGroupRoot, useForwardPropsEmits } from 'radix-vue'
import { provide, reactive, toRef } from 'vue'
import { cn } from '@/lib/utils'
import { useResolvedDirection } from '@/lib/rtl'

type ToggleGroupVariants = VariantProps<typeof toggleVariants>

const props = withDefaults(
  defineProps<
    ToggleGroupRootProps & {
      class?: HTMLAttributes['class']
      variant?: ToggleGroupVariants['variant']
      size?: ToggleGroupVariants['size']
    }
  >(),
  {
    variant: undefined,
    size: undefined,
  },
)
const emits = defineEmits<ToggleGroupRootEmits>()

provide(
  'toggleGroup',
  reactive({
    variant: toRef(props, 'variant'),
    size: toRef(props, 'size'),
  }),
)

const delegatedProps = reactiveOmit(props, 'class', 'variant', 'size')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
const dir = useResolvedDirection(() => props.dir)
</script>

<template>
  <ToggleGroupRoot
    v-slot="slotProps"
    v-bind="forwarded"
    :dir="dir"
    :class="cn('flex items-center justify-center gap-1', props.class)"
  >
    <slot v-bind="slotProps" />
  </ToggleGroupRoot>
</template>
