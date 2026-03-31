<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui"
import { Primitive, useForwardProps } from "reka-ui"
import { IconPlaceholder } from "@/registry/bases/reka/components/icon-placeholder"

const props = defineProps<PrimitiveProps>()
const forwardedProps = useForwardProps(props)
</script>

<template>
  <Primitive
    data-slot="pin-input-separator"
    v-bind="forwardedProps"
  >
    <slot>
      <IconPlaceholder lucide="MinusIcon" tabler="IconMinus" hugeicons="Minus01Icon" phosphor="MinusIcon" remixicon="RiSubtractLine" />
    </slot>
  </Primitive>
</template>
