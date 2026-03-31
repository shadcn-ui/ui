<script lang="ts" setup>
import { reactiveOmit } from "@vueuse/core"
import type { DrawerDescriptionProps } from "vaul-vue"
import { DrawerDescription } from "vaul-vue"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  DrawerDescriptionProps & { class?: HTMLAttributes["class"] }
>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <DrawerDescription
    data-slot="drawer-description"
    v-bind="delegatedProps"
    :class="cn('cn-drawer-description', props.class)"
  >
    <slot />
  </DrawerDescription>
</template>
