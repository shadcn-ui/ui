<script setup lang="ts">
import { ArrowUpRightIcon } from 'lucide-vue-next'
import { Button } from '@/ui/button'
</script>

<template>
  <div class="flex flex-col items-start gap-8 sm:flex-row">
    <div class="flex items-start gap-2">
      <Button size="sm" variant="outline">
        Small
      </Button>
      <Button size="icon-sm" aria-label="Submit" variant="outline">
        <ArrowUpRightIcon />
      </Button>
    </div>
    <div class="flex items-start gap-2">
      <Button variant="outline">
        Default
      </Button>
      <Button size="icon" aria-label="Submit" variant="outline">
        <ArrowUpRightIcon />
      </Button>
    </div>
    <div class="flex items-start gap-2">
      <Button variant="outline" size="lg">
        Large
      </Button>
      <Button size="icon-lg" aria-label="Submit" variant="outline">
        <ArrowUpRightIcon />
      </Button>
    </div>
  </div>
</template>
