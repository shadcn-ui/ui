<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import {
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  type SliderRootEmits,
  type SliderRootProps,
  useForwardPropsEmits,
} from 'radix-vue'
import { cn } from '@/lib/utils'
import { useResolvedDirection } from '@/lib/rtl'

const props = withDefaults(defineProps<SliderRootProps & { class?: HTMLAttributes['class'] }>(), {
  defaultValue: () => [0],
})
const emits = defineEmits<SliderRootEmits>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
const dir = useResolvedDirection(() => props.dir)

const thumbCount = computed(() => props.modelValue?.length ?? props.defaultValue?.length ?? 1)
</script>

<template>
  <SliderRoot
    v-bind="forwarded"
    :dir="dir"
    :class="
      cn(
        'relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        props.class,
      )
    "
  >
    <SliderTrack
      class="relative grow overflow-hidden rounded-full bg-primary/20 data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
    >
      <SliderRange
        class="absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
      />
    </SliderTrack>
    <SliderThumb
      v-for="(_, key) in thumbCount"
      :key="key"
      class="block size-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    />
  </SliderRoot>
</template>
