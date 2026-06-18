<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

export const kbdVariants = cva(
  "cn-kbd pointer-events-none inline-flex items-center justify-center select-none",
  {
    variants: {
      variant: {
        default: "cn-kbd-variant-default",
        primary: "cn-kbd-variant-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type KbdVariants = VariantProps<typeof kbdVariants>

const props = defineProps<{
  variant?: KbdVariants["variant"]
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <kbd data-slot="kbd" :class="cn(kbdVariants({ variant }), props.class)">
    <slot />
  </kbd>
</template>
