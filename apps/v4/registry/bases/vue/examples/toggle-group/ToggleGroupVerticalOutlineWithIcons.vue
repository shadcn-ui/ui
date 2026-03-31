<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { ToggleGroup, ToggleGroupItem } from "@/ui/toggle-group"
</script>

<template>
  <ToggleGroup
    variant="outline"
    type="multiple"
    orientation="vertical"
    size="sm"
  >
    <ToggleGroupItem value="bold" aria-label="Toggle bold">
      <IconPlaceholder
        lucide="BoldIcon"
        tabler="IconBold"
        hugeicons="TextBoldIcon"
        phosphor="TextBIcon"
        remixicon="RiBold"
      />
    </ToggleGroupItem>
    <ToggleGroupItem value="italic" aria-label="Toggle italic">
      <IconPlaceholder
        lucide="ItalicIcon"
        tabler="IconItalic"
        hugeicons="TextItalicIcon"
        phosphor="TextItalicIcon"
        remixicon="RiItalic"
      />
    </ToggleGroupItem>
    <ToggleGroupItem value="underline" aria-label="Toggle underline">
      <IconPlaceholder
        lucide="UnderlineIcon"
        tabler="IconUnderline"
        hugeicons="TextUnderlineIcon"
        phosphor="TextUnderlineIcon"
        remixicon="RiUnderline"
      />
    </ToggleGroupItem>
  </ToggleGroup>
</template>
