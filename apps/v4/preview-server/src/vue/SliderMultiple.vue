<script setup lang="ts">
import { Slider } from "@/ui/slider"
</script>

<template>
  <Slider :default-value="[10, 20, 70]" :max="100" :step="10" />
</template>
