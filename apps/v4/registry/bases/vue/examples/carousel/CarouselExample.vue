<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import CarouselBasic from "@/examples/carousel/CarouselBasic.vue"
import CarouselMultiple from "@/examples/carousel/CarouselMultiple.vue"
import CarouselWithGap from "@/examples/carousel/CarouselWithGap.vue"
</script>

<template>
  <ExampleWrapper class="lg:grid-cols-1">
    <CarouselBasic />
    <CarouselMultiple />
    <CarouselWithGap />
  </ExampleWrapper>
</template>
