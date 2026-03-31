<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Toggle } from "@/ui/toggle"
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <Toggle variant="outline" aria-label="Toggle italic">
      <IconPlaceholder
        lucide="ItalicIcon"
        tabler="IconItalic"
        hugeicons="TextItalicIcon"
        phosphor="TextItalicIcon"
        remixicon="RiItalic"
      />
      Italic
    </Toggle>
    <Toggle variant="outline" aria-label="Toggle bold">
      <IconPlaceholder
        lucide="BoldIcon"
        tabler="IconBold"
        hugeicons="TextBoldIcon"
        phosphor="TextBIcon"
        remixicon="RiBold"
      />
      Bold
    </Toggle>
  </div>
</template>
