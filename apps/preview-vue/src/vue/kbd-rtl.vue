<script setup lang="ts">
import { Kbd, KbdGroup } from '@/ui/kbd'
</script>

<template>
  <div class="flex flex-col items-center gap-4" dir="rtl">
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>⌥</Kbd>
      <Kbd>⌃</Kbd>
    </KbdGroup>
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <span>+</span>
      <Kbd>B</Kbd>
    </KbdGroup>
  </div>
</template>
