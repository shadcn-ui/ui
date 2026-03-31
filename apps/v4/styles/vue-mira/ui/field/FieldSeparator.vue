<script setup lang="ts">
import { Separator } from "@/ui/separator"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="field-separator"
    :data-content="!!$slots.default"
    :class="
      cn(
        'relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2',
        props.class
      )
    "
  >
    <Separator class="absolute inset-0 top-1/2" />
    <span
      v-if="$slots.default"
      class="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
      data-slot="field-separator-content"
    >
      <slot />
    </span>
  </div>
</template>
