<script setup lang="ts">
import { Badge } from '@/ui/badge'
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Badge>Default</Badge>
    <Badge variant="secondary">Secondary</Badge>
    <Badge variant="destructive">Destructive</Badge>
    <Badge variant="outline">Outline</Badge>
    <Badge variant="ghost">Ghost</Badge>
  </div>
</template>
