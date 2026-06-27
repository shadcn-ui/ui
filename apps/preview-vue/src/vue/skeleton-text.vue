<script setup lang="ts">
import { Skeleton } from '@/ui/skeleton'
</script>

<template>
  <div class="flex w-full max-w-xs flex-col gap-2">
    <Skeleton class="h-4 w-full" />
    <Skeleton class="h-4 w-full" />
    <Skeleton class="h-4 w-3/4" />
  </div>
</template>
