<script setup lang="ts">
import { ref } from 'vue'
import { Progress } from '@/ui/progress'
import { Slider } from '@/ui/slider'

const value = ref([50])
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-4">
    <Progress :model-value="value[0]" />
    <Slider v-model="value" :min="0" :max="100" :step="1" />
  </div>
</template>
