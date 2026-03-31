<script setup lang="ts">
import { Example } from "@/components/example"
import { Card, CardContent, CardHeader } from "@/ui/card"
import { Skeleton } from "@/ui/skeleton"
</script>

<template>
  <Example title="Card">
    <Card class="w-full">
      <CardHeader>
        <Skeleton class="h-4 w-2/3" />
        <Skeleton class="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton class="aspect-square w-full" />
      </CardContent>
    </Card>
  </Example>
</template>
