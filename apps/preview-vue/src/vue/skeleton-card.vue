<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/ui/card'
import { Skeleton } from '@/ui/skeleton'
</script>

<template>
  <Card class="w-full max-w-xs">
    <CardHeader>
      <Skeleton class="h-4 w-2/3" />
      <Skeleton class="h-4 w-1/2" />
    </CardHeader>
    <CardContent>
      <Skeleton class="aspect-video w-full" />
    </CardContent>
  </Card>
</template>
