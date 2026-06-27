<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@/ui/label'
import { Slider } from '@/ui/slider'

const value = ref([0.3, 0.7])
</script>

<template>
  <div class="mx-auto grid w-full max-w-xs gap-3">
    <div class="flex items-center justify-between gap-2">
      <Label for="slider-controlled-temperature">Temperature</Label>
      <span class="text-sm text-muted-foreground">{{ value.join(', ') }}</span>
    </div>
    <Slider
      id="slider-controlled-temperature"
      :value="value"
      :min="0"
      :max="1"
      :step="0.1"
      @value-change="value = $event"
    />
  </div>
</template>
