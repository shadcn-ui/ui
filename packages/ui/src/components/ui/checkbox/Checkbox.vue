<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  CheckboxIndicator,
  CheckboxRoot,
  type CheckboxRootEmits,
  type CheckboxRootProps,
  useForwardPropsEmits,
} from 'radix-vue'
import { Check, Minus } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps<CheckboxRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<CheckboxRootEmits>()
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <CheckboxRoot
    v-bind="forwarded"
    :class="
      cn(
        'group peer size-4 shrink-0 rounded-[4px] border border-primary shadow',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
        'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
        props.class,
      )
    "
  >
    <CheckboxIndicator class="flex items-center justify-center text-current">
      <Check class="size-3.5 group-data-[state=indeterminate]:hidden" aria-hidden="true" />
      <Minus class="hidden size-3.5 group-data-[state=indeterminate]:block" aria-hidden="true" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
