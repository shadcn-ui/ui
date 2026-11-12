<script setup lang="ts">
import type { TagsInputInputProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { TagsInputInput, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<TagsInputInputProps & { class?: HTMLAttributes['class'] }>(),
  { placeholder: 'برچسب جدید…' },
)

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <TagsInputInput
    v-bind="forwarded"
    :class="
      cn(
        'min-h-6 min-w-24 flex-1 bg-transparent px-1 text-sm placeholder:text-muted-foreground focus:outline-none',
        props.class,
      )
    "
  />
</template>
