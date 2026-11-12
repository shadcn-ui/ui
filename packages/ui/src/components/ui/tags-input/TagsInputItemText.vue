<script setup lang="ts">
import type { TagsInputItemTextProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { TagsInputItemText, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<TagsInputItemTextProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <TagsInputItemText
    v-bind="forwarded"
    :class="cn('rounded bg-transparent px-2 py-0.5 text-sm', props.class)"
  />
</template>
