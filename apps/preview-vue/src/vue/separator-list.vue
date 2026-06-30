<script setup lang="ts">
import { Separator } from '@/ui/separator'
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-2 text-sm">
    <dl class="flex items-center justify-between">
      <dt>Item 1</dt>
      <dd class="text-muted-foreground">Value 1</dd>
    </dl>
    <Separator />
    <dl class="flex items-center justify-between">
      <dt>Item 2</dt>
      <dd class="text-muted-foreground">Value 2</dd>
    </dl>
    <Separator />
    <dl class="flex items-center justify-between">
      <dt>Item 3</dt>
      <dd class="text-muted-foreground">Value 3</dd>
    </dl>
  </div>
</template>
