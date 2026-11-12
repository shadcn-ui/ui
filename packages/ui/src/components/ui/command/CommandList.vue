<script setup lang="ts">
import type { ListboxContentProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ListboxContent, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ListboxContentProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <ListboxContent
    v-bind="forwarded"
    :class="cn('max-h-[300px] overflow-y-auto overflow-x-hidden', props.class)"
  >
    <div role="presentation">
      <slot />
    </div>
  </ListboxContent>
</template>
