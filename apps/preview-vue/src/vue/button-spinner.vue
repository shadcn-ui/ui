<script setup lang="ts">
import { Button } from '@/ui/button'
import { Spinner } from '@/ui/spinner'
</script>

<template>
  <div class="flex gap-2">
    <Button variant="outline" disabled>
      <Spinner data-icon="inline-start" class="animate-spin" />
      Generating
    </Button>
    <Button variant="secondary" disabled>
      Downloading
      <Spinner data-icon="inline-start" class="animate-spin" />
    </Button>
  </div>
</template>
