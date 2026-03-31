<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import TooltipBasic from "@/examples/tooltip/TooltipBasic.vue"
import TooltipDisabled from "@/examples/tooltip/TooltipDisabled.vue"
import TooltipFormatted from "@/examples/tooltip/TooltipFormatted.vue"
import TooltipLongContent from "@/examples/tooltip/TooltipLongContent.vue"
import TooltipOnLink from "@/examples/tooltip/TooltipOnLink.vue"
import TooltipSides from "@/examples/tooltip/TooltipSides.vue"
import TooltipWithIcon from "@/examples/tooltip/TooltipWithIcon.vue"
import TooltipWithKeyboard from "@/examples/tooltip/TooltipWithKeyboard.vue"
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
