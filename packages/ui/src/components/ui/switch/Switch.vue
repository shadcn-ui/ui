<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  SwitchRoot,
  SwitchThumb,
  type SwitchRootEmits,
  type SwitchRootProps,
  useForwardPropsEmits,
} from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<SwitchRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<SwitchRootEmits>()
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <SwitchRoot
    v-bind="forwarded"
    :class="
      cn(
        'peer relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full',
        'bg-input transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-primary',
        props.class,
      )
    "
  >
    <SwitchThumb
      :class="
        cn(
          'pointer-events-none absolute start-0.5 top-0.5 block size-4 rounded-full bg-background shadow',
          'transition-all data-[state=checked]:start-[calc(100%-1.125rem)]',
        )
      "
    />
  </SwitchRoot>
</template>
