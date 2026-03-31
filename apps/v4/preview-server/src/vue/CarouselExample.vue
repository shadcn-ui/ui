<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import CarouselBasic from "./CarouselBasic.vue"
import CarouselMultiple from "./CarouselMultiple.vue"
import CarouselWithGap from "./CarouselWithGap.vue"
</script>

<template>
  <ExampleWrapper class="lg:grid-cols-1">
    <CarouselBasic />
    <CarouselMultiple />
    <CarouselWithGap />
  </ExampleWrapper>
</template>
