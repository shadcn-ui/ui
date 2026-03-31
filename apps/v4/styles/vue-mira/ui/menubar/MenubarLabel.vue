<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { MenubarLabelProps } from "reka-ui"
import { MenubarLabel } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  MenubarLabelProps & { class?: HTMLAttributes["class"]; inset?: boolean }
>()
const delegatedProps = reactiveOmit(props, "class", "inset")
</script>

<template>
  <MenubarLabel
    data-slot="menubar-label"
    :data-inset="inset ? '' : undefined"
    v-bind="delegatedProps"
    :class="cn('cn-menubar-label', props.class)"
  >
    <slot />
  </MenubarLabel>
</template>
