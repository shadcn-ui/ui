<script setup lang="ts">
import { Toggle } from "@/ui/toggle"
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <Toggle variant="outline" aria-label="Toggle small" size="sm">
      Small
    </Toggle>
    <Toggle variant="outline" aria-label="Toggle default" size="default">
      Default
    </Toggle>
    <Toggle variant="outline" aria-label="Toggle large" size="lg">
      Large
    </Toggle>
  </div>
</template>
