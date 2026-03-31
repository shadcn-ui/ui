<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { MenubarRootEmits, MenubarRootProps } from "reka-ui"
import { MenubarRoot, useForwardPropsEmits } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  MenubarRootProps & { class?: HTMLAttributes["class"] }
>()
const emits = defineEmits<MenubarRootEmits>()

const delegatedProps = reactiveOmit(props, "class")

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <MenubarRoot
    v-slot="slotProps"
    data-slot="menubar"
    v-bind="forwarded"
    :class="cn('cn-menubar flex items-center', props.class)"
  >
    <slot v-bind="slotProps" />
  </MenubarRoot>
</template>
