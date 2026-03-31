<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { TooltipContentEmits, TooltipContentProps } from "reka-ui"
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  useForwardPropsEmits,
} from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<TooltipContentProps & { class?: HTMLAttributes["class"] }>(),
  {
    sideOffset: 4,
  }
)

const emits = defineEmits<TooltipContentEmits>()

const delegatedProps = reactiveOmit(props, "class")
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      data-slot="tooltip-content"
      v-bind="{ ...forwarded, ...$attrs }"
      :class="
        cn(
          'cn-tooltip-content z-50 w-fit max-w-xs origin-(--reka-tooltip-content-transform-origin) bg-foreground text-background',
          props.class
        )
      "
    >
      <slot />

      <TooltipArrow
        class="cn-tooltip-arrow z-50 translate-y-[calc(-50%_-_2px)] bg-foreground fill-foreground"
      />
    </TooltipContent>
  </TooltipPortal>
</template>
