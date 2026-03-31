<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { DialogOverlayProps } from "reka-ui"
import { DialogOverlay } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  DialogOverlayProps & { class?: HTMLAttributes["class"] }
>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <DialogOverlay
    data-slot="dialog-overlay"
    v-bind="delegatedProps"
    :class="cn('cn-dialog-overlay fixed inset-0 isolate z-50', props.class)"
  >
    <slot />
  </DialogOverlay>
</template>
