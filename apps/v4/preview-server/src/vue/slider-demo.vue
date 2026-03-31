<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components"
import SliderBasic from "./SliderBasic.vue"
import SliderControlled from "./SliderControlled.vue"
import SliderDisabled from "./SliderDisabled.vue"
import SliderMultiple from "./SliderMultiple.vue"
import SliderRange from "./SliderRange.vue"
import SliderVertical from "./SliderVertical.vue"
</script>

<template>
  <ExampleWrapper>
    <Example title="Basic">
      <SliderBasic />
    </Example>
    <Example title="Range">
      <SliderRange />
    </Example>
    <Example title="Multiple Thumbs">
      <SliderMultiple />
    </Example>
    <Example title="Vertical">
      <SliderVertical />
    </Example>
    <Example title="Controlled">
      <SliderControlled />
    </Example>
    <Example title="Disabled">
      <SliderDisabled />
    </Example>
  </ExampleWrapper>
</template>
