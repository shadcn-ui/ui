<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { useForwardProps } from "reka-ui"
import IconPlaceholder from "@/components/IconPlaceholder.vue"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()

const forwarded = useForwardProps(props)
</script>

<template>
  <div
    data-slot="input-otp-separator"
    role="separator"
    v-bind="forwarded"
  >
    <slot>
      <IconPlaceholder lucide="MinusIcon" tabler="IconMinus" hugeicons="Minus01Icon" phosphor="MinusIcon" remixicon="RiSubtractLine" />
    </slot>
  </div>
</template>
