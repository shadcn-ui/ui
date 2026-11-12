<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { AvatarRoot, type AvatarRootProps, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'
import type { AvatarVariants } from '.'
import { avatarVariant } from '.'

const props = withDefaults(
  defineProps<
    AvatarRootProps & {
      class?: HTMLAttributes['class']
      size?: AvatarVariants['size']
      shape?: AvatarVariants['shape']
    }
  >(),
  {
    size: 'sm',
    shape: 'circle',
  },
)

const delegatedProps = reactiveOmit(props, 'class', 'size', 'shape')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <AvatarRoot v-bind="forwarded" :class="cn(avatarVariant({ size, shape }), props.class)">
    <slot />
  </AvatarRoot>
</template>
