<script setup lang="ts">
import { ArrowUpIcon } from 'lucide-vue-next'
import { Button } from '@/ui/button'
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 md:flex-row">
    <Button variant="outline">
      Button
    </Button>
    <Button variant="outline" size="icon" aria-label="Submit">
      <ArrowUpIcon />
    </Button>
  </div>
</template>
