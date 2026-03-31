<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from "@/ui/toggle-group"
</script>

<template>
  <ToggleGroup
    variant="outline"
    type="single"
    default-value="all"
    orientation="vertical"
    size="sm"
  >
    <ToggleGroupItem value="all" aria-label="Toggle all">
      All
    </ToggleGroupItem>
    <ToggleGroupItem value="active" aria-label="Toggle active">
      Active
    </ToggleGroupItem>
    <ToggleGroupItem value="completed" aria-label="Toggle completed">
      Completed
    </ToggleGroupItem>
    <ToggleGroupItem value="archived" aria-label="Toggle archived">
      Archived
    </ToggleGroupItem>
  </ToggleGroup>
</template>
