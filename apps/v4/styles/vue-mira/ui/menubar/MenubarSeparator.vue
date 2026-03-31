<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { MenubarSeparatorProps } from "reka-ui"
import { MenubarSeparator, useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  MenubarSeparatorProps & { class?: HTMLAttributes["class"] }
>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <MenubarSeparator
    data-slot="menubar-separator"
    :class="cn('cn-menubar-separator -mx-1 my-1 h-px', props.class)"
    v-bind="forwardedProps"
  />
</template>
