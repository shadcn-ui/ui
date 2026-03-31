<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import AspectRatio1x1 from "./AspectRatio1x1.vue"
import AspectRatio9x16 from "./AspectRatio9x16.vue"
import AspectRatio16x9 from "./AspectRatio16x9.vue"
import AspectRatio21x9 from "./AspectRatio21x9.vue"
</script>

<template>
  <ExampleWrapper class="max-w-4xl 2xl:max-w-4xl">
    <AspectRatio16x9 />
    <AspectRatio21x9 />
    <AspectRatio1x1 />
    <AspectRatio9x16 />
  </ExampleWrapper>
</template>
