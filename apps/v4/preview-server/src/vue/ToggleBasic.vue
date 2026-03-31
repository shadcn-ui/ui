<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Toggle } from "@/ui/toggle"
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <Toggle aria-label="Toggle bold" :default-pressed="true">
      <IconPlaceholder
        lucide="BoldIcon"
        tabler="IconBold"
        hugeicons="TextBoldIcon"
        phosphor="TextBIcon"
        remixicon="RiBold"
      />
    </Toggle>
    <Toggle aria-label="Toggle italic">
      <IconPlaceholder
        lucide="ItalicIcon"
        tabler="IconItalic"
        hugeicons="TextItalicIcon"
        phosphor="TextItalicIcon"
        remixicon="RiItalic"
      />
    </Toggle>
    <Toggle aria-label="Toggle underline">
      <IconPlaceholder
        lucide="UnderlineIcon"
        tabler="IconUnderline"
        hugeicons="TextUnderlineIcon"
        phosphor="TextUnderlineIcon"
        remixicon="RiUnderline"
      />
    </Toggle>
  </div>
</template>
