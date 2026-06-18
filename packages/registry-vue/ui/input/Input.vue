<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cva, type VariantProps } from "class-variance-authority"
import { useVModel } from "@vueuse/core"
import { cn } from "@/lib/utils"

export const inputVariants = cva(
  "cn-input w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        outline: "cn-input-variant-outline",
        filled: "cn-input-variant-filled",
        underline: "cn-input-variant-underline",
        ghost: "cn-input-variant-ghost",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  }
)

export type InputVariants = VariantProps<typeof inputVariants>

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  variant?: InputVariants["variant"]
  class?: HTMLAttributes["class"]
}>()

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void
}>()

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :class="cn(inputVariants({ variant }), props.class)"
  >
</template>
