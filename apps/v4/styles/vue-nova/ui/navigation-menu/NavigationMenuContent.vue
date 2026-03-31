<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type {
  NavigationMenuContentEmits,
  NavigationMenuContentProps,
} from "reka-ui"
import { NavigationMenuContent, useForwardPropsEmits } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  NavigationMenuContentProps & { class?: HTMLAttributes["class"] }
>()
const emits = defineEmits<NavigationMenuContentEmits>()

const delegatedProps = reactiveOmit(props, "class")

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <NavigationMenuContent
    data-slot="navigation-menu-content"
    v-bind="forwarded"
    :class="
      cn(
        'cn-navigation-menu-content top-0 left-0 w-full group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none md:absolute md:w-auto',
        props.class
      )
    "
  >
    <slot />
  </NavigationMenuContent>
</template>
