<script setup lang="ts">
import type { ComboboxGroupProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ComboboxGroup, ComboboxLabel } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<
  ComboboxGroupProps & {
    class?: HTMLAttributes['class']
    heading?: string
  }
>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <ComboboxGroup
    v-bind="delegatedProps"
    :class="
      cn(
        'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
        props.class,
      )
    "
  >
    <ComboboxLabel v-if="heading" class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
      {{ heading }}
    </ComboboxLabel>
    <slot />
  </ComboboxGroup>
</template>
