<script setup lang="ts">
import type { NavigationMenuContentEmits, NavigationMenuContentProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { NavigationMenuContent, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<NavigationMenuContentProps & { class?: HTMLAttributes['class'] }>()

const emits = defineEmits<NavigationMenuContentEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <NavigationMenuContent
    v-bind="forwarded"
    :class="
      cn(
        'start-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out md:absolute md:w-auto',
        props.class,
      )
    "
  >
    <slot />
  </NavigationMenuContent>
</template>
