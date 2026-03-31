<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from "@/ui/toggle-group"
</script>

<template>
  <ToggleGroup variant="outline" type="single" default-value="all">
    <ToggleGroupItem value="all" aria-label="Toggle all">
      All
    </ToggleGroupItem>
    <ToggleGroupItem value="missed" aria-label="Toggle missed">
      Missed
    </ToggleGroupItem>
  </ToggleGroup>
</template>
