<script setup lang="ts">
import { Spinner } from '@/ui/spinner'
</script>

<template>
  <div class="flex items-center gap-6">
    <Spinner class="size-6 text-red-500" />
    <Spinner class="size-6 text-green-500" />
    <Spinner class="size-6 text-blue-500" />
    <Spinner class="size-6 text-yellow-500" />
    <Spinner class="size-6 text-purple-500" />
  </div>
</template>
