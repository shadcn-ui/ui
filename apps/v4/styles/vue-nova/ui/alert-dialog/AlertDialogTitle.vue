<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { AlertDialogTitleProps } from "reka-ui"
import { AlertDialogTitle } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  AlertDialogTitleProps & { class?: HTMLAttributes["class"] }
>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <AlertDialogTitle
    data-slot="alert-dialog-title"
    v-bind="delegatedProps"
    :class="cn('cn-alert-dialog-title', props.class)"
  >
    <slot />
  </AlertDialogTitle>
</template>
