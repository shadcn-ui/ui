<script setup lang="ts">
import { Button } from "@/ui/button"
import { Toggle } from "@/ui/toggle"
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <Button size="sm" variant="outline">
        Button
      </Button>
      <Toggle variant="outline" aria-label="Toggle sm" size="sm">
        Toggle
      </Toggle>
    </div>
    <div class="flex items-center gap-2">
      <Button size="default" variant="outline">
        Button
      </Button>
      <Toggle variant="outline" aria-label="Toggle default" size="default">
        Toggle
      </Toggle>
    </div>
    <div class="flex items-center gap-2">
      <Button size="lg" variant="outline">
        Button
      </Button>
      <Toggle variant="outline" aria-label="Toggle lg" size="lg">
        Toggle
      </Toggle>
    </div>
  </div>
</template>
