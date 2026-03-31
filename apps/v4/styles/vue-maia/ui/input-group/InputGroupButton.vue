<script setup lang="ts">
import { Button } from "@/ui/button"

import { cn } from "@/lib/utils"

import type { InputGroupButtonProps } from "."
import { inputGroupButtonVariants } from "."

const props = withDefaults(defineProps<InputGroupButtonProps>(), {
  size: "xs",
  variant: "ghost",
})
</script>

<template>
  <Button
    :data-size="props.size"
    :variant="props.variant"
    :class="cn(inputGroupButtonVariants({ size: props.size }), props.class)"
  >
    <slot />
  </Button>
</template>
