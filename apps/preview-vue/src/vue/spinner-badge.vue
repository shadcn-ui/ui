<script setup lang="ts">
import { Badge } from '@/ui/badge'
import { Spinner } from '@/ui/spinner'
</script>

<template>
  <div class="flex items-center gap-4 [--radius:1.2rem]">
    <Badge>
      <Spinner />
      Syncing
    </Badge>
    <Badge variant="secondary">
      <Spinner />
      Updating
    </Badge>
    <Badge variant="outline">
      <Spinner />
      Processing
    </Badge>
  </div>
</template>
