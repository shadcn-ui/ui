<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { SeparatorProps } from "reka-ui"
import { Separator } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  SeparatorProps & { class?: HTMLAttributes["class"] }
>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <Separator
    data-slot="command-separator"
    v-bind="delegatedProps"
    :class="cn('cn-command-separator', props.class)"
  >
    <slot />
  </Separator>
</template>
