<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import TooltipBasic from "./TooltipBasic.vue"
import TooltipDisabled from "./TooltipDisabled.vue"
import TooltipFormatted from "./TooltipFormatted.vue"
import TooltipLongContent from "./TooltipLongContent.vue"
import TooltipOnLink from "./TooltipOnLink.vue"
import TooltipSides from "./TooltipSides.vue"
import TooltipWithIcon from "./TooltipWithIcon.vue"
import TooltipWithKeyboard from "./TooltipWithKeyboard.vue"
</script>

<template>
  <ExampleWrapper>
    <TooltipBasic />
    <TooltipSides />
    <TooltipWithIcon />
    <TooltipLongContent />
    <TooltipDisabled />
    <TooltipWithKeyboard />
    <TooltipOnLink />
    <TooltipFormatted />
  </ExampleWrapper>
</template>
