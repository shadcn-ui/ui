<script setup lang="ts">
import { Slider } from '@/ui/slider'
</script>

<template>
  <Slider
    :default-value="[50]"
    :max="100"
    :step="1"
    class="w-[60%]"
  />
</template>
