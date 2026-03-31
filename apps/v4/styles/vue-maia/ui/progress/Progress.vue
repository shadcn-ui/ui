<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { ProgressRootProps } from "reka-ui"
import { ProgressIndicator, ProgressRoot } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<ProgressRootProps & { class?: HTMLAttributes["class"] }>(),
  {
    modelValue: 0,
  }
)

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <ProgressRoot
    data-slot="progress"
    v-bind="delegatedProps"
    :class="
      cn(
        'cn-progress relative flex w-full items-center overflow-x-hidden',
        props.class
      )
    "
  >
    <ProgressIndicator
      data-slot="progress-indicator"
      class="cn-progress-indicator size-full flex-1 transition-all"
      :style="`transform: translateX(-${100 - (props.modelValue ?? 0)}%);`"
    />
  </ProgressRoot>
</template>
