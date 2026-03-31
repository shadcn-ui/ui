<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  title: string
  containerClassName?: string
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="example"
    :class="cn(
      'mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none',
      containerClassName,
    )"
  >
    <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">
      {{ title }}
    </div>
    <div
      data-slot="example-content"
      :class="cn(
        `bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full`,
        props.class,
      )"
    >
      <slot />
    </div>
  </div>
</template>
