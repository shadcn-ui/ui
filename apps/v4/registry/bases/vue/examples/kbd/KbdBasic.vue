<script setup lang="ts">
import { Kbd } from "@/ui/kbd"
import { Example } from "@/components/example"
</script>

<template>
  <Example title="Basic Kbd">
    <div class="flex flex-wrap items-center gap-4">
      <div class="flex items-center gap-2">
        <span class="text-sm">Save:</span>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>S</Kbd>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-sm">Copy:</span>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>C</Kbd>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-sm">Paste:</span>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>V</Kbd>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-sm">Undo:</span>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>Z</Kbd>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-sm">Search:</span>
        <Kbd>/</Kbd>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-sm">Escape:</span>
        <Kbd>Esc</Kbd>
      </div>
    </div>
  </Example>
</template>
