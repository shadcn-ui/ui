<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { AvatarImage, type AvatarImageProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<AvatarImageProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <AvatarImage v-bind="props" :class="cn('h-full w-full object-cover', props.class)">
    <slot />
  </AvatarImage>
</template>
