<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { ContextMenuSeparatorProps } from "reka-ui"
import { ContextMenuSeparator } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  ContextMenuSeparatorProps & { class?: HTMLAttributes["class"] }
>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <ContextMenuSeparator
    data-slot="context-menu-separator"
    v-bind="delegatedProps"
    :class="cn('cn-context-menu-separator', props.class)"
  />
</template>
