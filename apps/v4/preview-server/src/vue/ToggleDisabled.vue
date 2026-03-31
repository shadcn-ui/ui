<script setup lang="ts">
import { Toggle } from "@/ui/toggle"
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <Toggle aria-label="Toggle disabled" :disabled="true">
      Disabled
    </Toggle>
    <Toggle variant="outline" aria-label="Toggle disabled outline" :disabled="true">
      Disabled
    </Toggle>
  </div>
</template>
