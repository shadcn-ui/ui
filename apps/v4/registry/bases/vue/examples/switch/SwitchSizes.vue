<script setup lang="ts">
import { Label } from "@/ui/label"
import { Switch } from "@/ui/switch"
</script>

<template>
  <div class="flex flex-col gap-12">
    <div class="flex items-center gap-2">
      <Switch id="switch-size-sm" size="sm" />
      <Label html-for="switch-size-sm">Small</Label>
    </div>
    <div class="flex items-center gap-2">
      <Switch id="switch-size-default" size="default" />
      <Label html-for="switch-size-default">Default</Label>
    </div>
  </div>
</template>
