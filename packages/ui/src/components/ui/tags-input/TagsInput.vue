<script setup lang="ts">
import type { TagsInputRootEmits, TagsInputRootProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { TagsInputRoot, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'
import { useResolvedDirection } from '@/lib/rtl'

const props = defineProps<TagsInputRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<TagsInputRootEmits>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
const dir = useResolvedDirection(() => props.dir)
</script>

<template>
  <TagsInputRoot
    v-slot="slotProps"
    v-bind="forwarded"
    :dir="dir"
    :class="
      cn(
        'flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-background px-2 py-1.5 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        props.class,
      )
    "
  >
    <slot v-bind="slotProps" />
  </TagsInputRoot>
</template>
