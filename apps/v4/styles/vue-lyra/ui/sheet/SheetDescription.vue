<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { DialogDescriptionProps } from "reka-ui"
import { DialogDescription } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  DialogDescriptionProps & { class?: HTMLAttributes["class"] }
>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <DialogDescription
    data-slot="sheet-description"
    :class="cn('cn-sheet-description', props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </DialogDescription>
</template>
