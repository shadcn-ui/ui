<script setup lang="ts">
import { Slider } from "@/ui/slider"
</script>

<template>
  <Slider :default-value="[25, 50]" :max="100" :step="5" />
</template>
