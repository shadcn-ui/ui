<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { IconPlaceholder } from "@/components/icon-placeholder"

export const spinnerVariants = cva("cn-spinner animate-spin", {
  variants: {
    color: {
      default: "cn-spinner-color-default",
      primary: "cn-spinner-color-primary",
      onPrimary: "cn-spinner-color-onPrimary",
      inherit: "cn-spinner-color-inherit",
    },
    size: {
      xs: "cn-spinner-size-xs",
      sm: "cn-spinner-size-sm",
      md: "cn-spinner-size-md",
      lg: "cn-spinner-size-lg",
    },
  },
  defaultVariants: {
    color: "default",
    size: "sm",
  },
})

export type SpinnerVariants = VariantProps<typeof spinnerVariants>

const props = defineProps<{
  color?: SpinnerVariants["color"]
  size?: SpinnerVariants["size"]
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <IconPlaceholder
    lucide="Loader2Icon"
    tabler="IconLoader2"
    hugeicons="Loading03Icon"
    phosphor="SpinnerGapIcon"
    remixicon="RiLoader4Line"
    role="status"
    aria-label="Loading"
    :class="cn(spinnerVariants({ color, size }), props.class)"
  />
</template>
