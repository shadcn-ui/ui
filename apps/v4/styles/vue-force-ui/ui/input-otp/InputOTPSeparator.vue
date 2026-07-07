<script setup lang="ts">
import { useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { IconPlaceholder } from "@/components/icon-placeholder"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()

const forwarded = useForwardProps(props)
</script>

<template>
  <div
    data-slot="input-otp-separator"
    class="cn-input-otp-separator"
    role="separator"
    aria-orientation="vertical"
    v-bind="forwarded"
  >
    <slot>
      <IconPlaceholder
        lucide="MinusIcon"
        materialSymbols="remove"
        tabler="IconMinus"
        hugeicons="Minus01Icon"
        phosphor="MinusIcon"
        remixicon="RiSubtractLine"
      />
    </slot>
  </div>
</template>
