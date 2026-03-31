<script setup lang="ts">
import { Kbd, KbdGroup } from "@/ui/kbd"
import { Example } from "@/components/example"
</script>

<template>
  <Example title="Kbd with Group">
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <span class="text-sm">Select all:</span>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>A</Kbd>
        </KbdGroup>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-sm">Open command palette:</span>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-sm">Find and replace:</span>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>H</Kbd>
        </KbdGroup>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-sm">Multiple selection:</span>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>L</Kbd>
        </KbdGroup>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-sm">Toggle terminal:</span>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>`</Kbd>
        </KbdGroup>
      </div>
    </div>
  </Example>
</template>
