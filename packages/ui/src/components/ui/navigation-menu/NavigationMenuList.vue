<script setup lang="ts">
import type { NavigationMenuListProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { NavigationMenuList, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<NavigationMenuListProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <NavigationMenuList
    v-bind="forwardedProps"
    :class="cn('group flex flex-1 list-none items-center justify-center gap-x-1', props.class)"
  >
    <slot />
  </NavigationMenuList>
</template>
