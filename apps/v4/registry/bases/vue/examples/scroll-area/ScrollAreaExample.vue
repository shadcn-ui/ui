<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components/example"
import ScrollAreaHorizontal from "@/examples/scroll-area/ScrollAreaHorizontal.vue"
import ScrollAreaVertical from "@/examples/scroll-area/ScrollAreaVertical.vue"
</script>

<template>
  <ExampleWrapper>
    <Example title="Vertical">
      <ScrollAreaVertical />
    </Example>
    <Example title="Horizontal">
      <ScrollAreaHorizontal />
    </Example>
  </ExampleWrapper>
</template>
