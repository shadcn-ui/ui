<script setup lang="ts">
import { Example } from "@/components"
import { Skeleton } from "@/ui/skeleton"
</script>

<template>
  <Example title="Avatar">
    <div class="flex w-full items-center gap-4">
      <Skeleton class="size-10 shrink-0 rounded-full" />
      <div class="grid gap-2">
        <Skeleton class="h-4 w-[150px]" />
        <Skeleton class="h-4 w-[100px]" />
      </div>
    </div>
  </Example>
</template>
