<script setup lang="ts">
import { Badge } from '@/ui/badge'
import { Spinner } from '@/ui/spinner'
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Badge variant="destructive">
      <Spinner data-icon="inline-start" />
      Deleting
    </Badge>
    <Badge variant="secondary">
      Generating
      <Spinner data-icon="inline-end" />
    </Badge>
  </div>
</template>
