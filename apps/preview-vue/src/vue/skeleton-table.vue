<script setup lang="ts">
import { Skeleton } from '@/ui/skeleton'
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-2">
    <div
      v-for="index in 5"
      :key="index"
      class="flex gap-4"
    >
      <Skeleton class="h-4 flex-1" />
      <Skeleton class="h-4 w-24" />
      <Skeleton class="h-4 w-20" />
    </div>
  </div>
</template>
