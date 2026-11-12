<script setup lang="ts">
import type { NavigationMenuRootEmits, NavigationMenuRootProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { NavigationMenuRoot, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'
import { useResolvedDirection } from '@/lib/rtl'
import NavigationMenuViewport from './NavigationMenuViewport.vue'

const props = defineProps<NavigationMenuRootProps & { class?: HTMLAttributes['class'] }>()

const emits = defineEmits<NavigationMenuRootEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
const dir = useResolvedDirection(() => props.dir)
</script>

<template>
  <NavigationMenuRoot
    v-bind="forwarded"
    :dir="dir"
    :class="cn('relative z-10 flex max-w-max flex-1 items-center justify-center', props.class)"
  >
    <slot />
    <NavigationMenuViewport />
  </NavigationMenuRoot>
</template>
