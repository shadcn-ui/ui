<script setup lang="ts">
import { toggleVariants } from "@/ui/toggle"
import { reactiveOmit } from "@vueuse/core"
import type { VariantProps } from "class-variance-authority"
import type { ToggleGroupItemProps } from "reka-ui"
import { ToggleGroupItem, useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { inject } from "vue"

import { cn } from "@/lib/utils"

type ToggleGroupVariants = VariantProps<typeof toggleVariants> & {
  spacing?: number
}

const props = defineProps<
  ToggleGroupItemProps & {
    class?: HTMLAttributes["class"]
    variant?: ToggleGroupVariants["variant"]
    size?: ToggleGroupVariants["size"]
  }
>()

const context = inject<ToggleGroupVariants>("toggleGroup")

const delegatedProps = reactiveOmit(props, "class", "size", "variant")
const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <ToggleGroupItem
    v-slot="slotProps"
    data-slot="toggle-group-item"
    :data-variant="context?.variant || variant"
    :data-size="context?.size || size"
    :data-spacing="context?.spacing"
    v-bind="forwardedProps"
    :class="
      cn(
        'cn-toggle-group-item shrink-0 focus:z-10 focus-visible:z-10 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t',
        toggleVariants({
          variant: context?.variant || variant,
          size: context?.size || size,
        }),
        props.class
      )
    "
  >
    <slot v-bind="slotProps" />
  </ToggleGroupItem>
</template>
