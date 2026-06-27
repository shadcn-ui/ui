<script setup lang="ts">
import { Slider } from '@/ui/slider'
</script>

<template>
  <Slider
    :default-value="[75]"
    :max="100"
    :step="1"
    dir="rtl"
    class="mx-auto w-full max-w-xs"
  />
</template>
