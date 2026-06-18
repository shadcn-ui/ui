<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { useVModel } from "@vueuse/core"
import { cn } from "@/lib/utils"

type Variant = "outline" | "filled" | "underline" | "ghost"

const variantClass: Record<Variant, string> = {
  outline: "cn-textarea-variant-outline",
  filled: "cn-textarea-variant-filled",
  underline: "cn-textarea-variant-underline",
  ghost: "cn-textarea-variant-ghost",
}

const props = defineProps<{
  class?: HTMLAttributes["class"]
  defaultValue?: string | number
  modelValue?: string | number
  variant?: Variant
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
  <textarea
    v-model="modelValue"
    data-slot="textarea"
    :class="cn('cn-textarea placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50', variantClass[props.variant ?? 'outline'], props.class)"
  />
</template>
