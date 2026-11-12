<script setup lang="ts">
import type { TagsInputItemProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { TagsInputItem, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<TagsInputItemProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <TagsInputItem
    v-bind="forwarded"
    :class="
      cn(
        'flex h-6 items-center gap-0.5 rounded-md bg-secondary text-secondary-foreground ring-offset-background data-[state=active]:ring-2 data-[state=active]:ring-ring data-[state=active]:ring-offset-2',
        props.class,
      )
    "
  >
    <slot />
  </TagsInputItem>
</template>
