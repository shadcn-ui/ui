<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components/example"
import SliderBasic from "@/examples/slider/SliderBasic.vue"
import SliderControlled from "@/examples/slider/SliderControlled.vue"
import SliderDisabled from "@/examples/slider/SliderDisabled.vue"
import SliderMultiple from "@/examples/slider/SliderMultiple.vue"
import SliderRange from "@/examples/slider/SliderRange.vue"
import SliderVertical from "@/examples/slider/SliderVertical.vue"
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
