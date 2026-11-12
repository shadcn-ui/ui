<script setup lang="ts">
import type { NavigationMenuIndicatorProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { NavigationMenuIndicator, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<NavigationMenuIndicatorProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <NavigationMenuIndicator
    v-bind="forwardedProps"
    :class="
      cn(
        'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
        props.class,
      )
    "
  >
    <div class="relative top-[60%] h-2 w-2 rotate-45 rounded-ss-sm bg-border shadow-md" />
  </NavigationMenuIndicator>
</template>
