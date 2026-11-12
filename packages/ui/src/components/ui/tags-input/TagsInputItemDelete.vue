<script setup lang="ts">
import type { TagsInputItemDeleteProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { X } from 'lucide-vue-next'
import { TagsInputItemDelete, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<TagsInputItemDeleteProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <TagsInputItemDelete
    v-bind="forwarded"
    aria-label="حذف برچسب"
    :class="
      cn(
        'me-1 flex rounded bg-transparent opacity-60 transition-opacity hover:opacity-100',
        props.class,
      )
    "
  >
    <slot>
      <X class="size-3.5" aria-hidden="true" />
    </slot>
  </TagsInputItemDelete>
</template>
