<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Button } from "@/ui/button"
import { Toggle } from "@/ui/toggle"
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <Button size="sm" variant="outline">
        <IconPlaceholder
          lucide="BoldIcon"
          tabler="IconBold"
          hugeicons="TextBoldIcon"
          phosphor="TextBIcon"
          remixicon="RiBold"
          data-icon="inline-start"
        />
        Button
      </Button>
      <Toggle variant="outline" aria-label="Toggle sm icon text" size="sm">
        <IconPlaceholder
          lucide="BoldIcon"
          tabler="IconBold"
          hugeicons="TextBoldIcon"
          phosphor="TextBIcon"
          remixicon="RiBold"
        />
        Toggle
      </Toggle>
    </div>
    <div class="flex items-center gap-2">
      <Button size="default" variant="outline">
        <IconPlaceholder
          lucide="ItalicIcon"
          tabler="IconItalic"
          hugeicons="TextItalicIcon"
          phosphor="TextItalicIcon"
          remixicon="RiItalic"
          data-icon="inline-start"
        />
        Button
      </Button>
      <Toggle
        variant="outline"
        aria-label="Toggle default icon text"
        size="default"
      >
        <IconPlaceholder
          lucide="ItalicIcon"
          tabler="IconItalic"
          hugeicons="TextItalicIcon"
          phosphor="TextItalicIcon"
          remixicon="RiItalic"
        />
        Toggle
      </Toggle>
    </div>
    <div class="flex items-center gap-2">
      <Button size="lg" variant="outline">
        <IconPlaceholder
          lucide="UnderlineIcon"
          tabler="IconUnderline"
          hugeicons="TextUnderlineIcon"
          phosphor="TextUnderlineIcon"
          remixicon="RiUnderline"
          data-icon="inline-start"
        />
        Button
      </Button>
      <Toggle variant="outline" aria-label="Toggle lg icon text" size="lg">
        <IconPlaceholder
          lucide="UnderlineIcon"
          tabler="IconUnderline"
          hugeicons="TextUnderlineIcon"
          phosphor="TextUnderlineIcon"
          remixicon="RiUnderline"
        />
        Toggle
      </Toggle>
    </div>
  </div>
</template>
