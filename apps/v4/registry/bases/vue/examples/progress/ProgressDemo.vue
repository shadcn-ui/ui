<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Progress } from '@/ui/progress'

const progress = ref(13)

onMounted(() => {
  const timer = setTimeout(() => {
    progress.value = 66
  }, 500)

  return () => clearTimeout(timer)
})
</script>

<template>
  <Progress :model-value="progress" class="w-[60%]" />
</template>
