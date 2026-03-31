<script setup lang="ts">
import { Label } from "@/ui/label"
import { Switch } from "@/ui/switch"
</script>

<template>
  <div class="flex flex-col gap-12">
    <div class="flex items-center gap-2">
      <Switch id="switch-disabled-unchecked" :disabled="true" />
      <Label html-for="switch-disabled-unchecked">
        Disabled (Unchecked)
      </Label>
    </div>
    <div class="flex items-center gap-2">
      <Switch id="switch-disabled-checked" :default-checked="true" :disabled="true" />
      <Label html-for="switch-disabled-checked">
        Disabled (Checked)
      </Label>
    </div>
  </div>
</template>
