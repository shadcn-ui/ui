<script setup lang="ts">
import { Button } from '@/ui/button'
import { Spinner } from '@/ui/spinner'
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <Button disabled size="sm">
      <Spinner />
      Loading...
    </Button>
    <Button variant="outline" disabled size="sm">
      <Spinner />
      Please wait
    </Button>
    <Button variant="secondary" disabled size="sm">
      <Spinner />
      Processing
    </Button>
  </div>
</template>
