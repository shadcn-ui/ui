<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from "@/ui/toggle-group"
</script>

<template>
  <ToggleGroup
    type="single"
    default-value="today"
    variant="outline"
    size="sm"
    :spacing="2"
  >
    <ToggleGroupItem value="today" aria-label="Today">
      Today
    </ToggleGroupItem>
    <ToggleGroupItem value="week" aria-label="This Week">
      This Week
    </ToggleGroupItem>
    <ToggleGroupItem value="month" aria-label="This Month">
      This Month
    </ToggleGroupItem>
    <ToggleGroupItem value="year" aria-label="This Year">
      This Year
    </ToggleGroupItem>
  </ToggleGroup>
</template>
