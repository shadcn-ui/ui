<script setup lang="ts">
import { Slider } from "@/ui/slider"
</script>

<template>
  <div class="flex items-center gap-6">
    <Slider
      :default-value="[50]"
      :max="100"
      :step="1"
      orientation="vertical"
      class="h-40"
    />
    <Slider
      :default-value="[25]"
      :max="100"
      :step="1"
      orientation="vertical"
      class="h-40"
    />
  </div>
</template>
