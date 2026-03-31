<script setup lang="ts">
import type { SelectLabelProps } from "reka-ui"
import { SelectLabel } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  SelectLabelProps & { class?: HTMLAttributes["class"] }
>()
</script>

<template>
  <SelectLabel
    data-slot="select-label"
    :class="cn('cn-select-label', props.class)"
  >
    <slot />
  </SelectLabel>
</template>
