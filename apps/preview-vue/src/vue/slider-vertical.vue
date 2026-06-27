<script setup lang="ts">
import { Slider } from '@/ui/slider'
</script>

<template>
  <div class="mx-auto flex w-full max-w-xs items-center justify-center gap-6">
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
