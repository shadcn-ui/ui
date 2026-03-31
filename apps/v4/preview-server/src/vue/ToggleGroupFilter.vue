<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from "@/ui/toggle-group"
</script>

<template>
  <ToggleGroup type="single" default-value="all" variant="outline" size="sm">
    <ToggleGroupItem value="all" aria-label="All">
      All
    </ToggleGroupItem>
    <ToggleGroupItem value="active" aria-label="Active">
      Active
    </ToggleGroupItem>
    <ToggleGroupItem value="completed" aria-label="Completed">
      Completed
    </ToggleGroupItem>
    <ToggleGroupItem value="archived" aria-label="Archived">
      Archived
    </ToggleGroupItem>
  </ToggleGroup>
</template>
