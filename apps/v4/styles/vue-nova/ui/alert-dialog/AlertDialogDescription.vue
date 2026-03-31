<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { AlertDialogDescriptionProps } from "reka-ui"
import { AlertDialogDescription } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  AlertDialogDescriptionProps & { class?: HTMLAttributes["class"] }
>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <AlertDialogDescription
    data-slot="alert-dialog-description"
    v-bind="delegatedProps"
    :class="cn('cn-alert-dialog-description', props.class)"
  >
    <slot />
  </AlertDialogDescription>
</template>
