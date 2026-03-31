<script setup lang="ts">
import { Example } from "@/components/example"
import { Separator } from "@/ui/separator"
</script>

<template>
  <Example title="Vertical Menu">
    <div class="style-lyra:text-xs/relaxed flex items-center gap-2 text-sm md:gap-4">
      <div class="flex flex-col gap-1">
        <span class="font-medium">Settings</span>
        <span class="text-xs text-muted-foreground">
          Manage preferences
        </span>
      </div>
      <Separator orientation="vertical" />
      <div class="flex flex-col gap-1">
        <span class="font-medium">Account</span>
        <span class="text-xs text-muted-foreground">
          Profile & security
        </span>
      </div>
      <Separator orientation="vertical" />
      <div class="flex flex-col gap-1">
        <span class="font-medium">Help</span>
        <span class="text-xs text-muted-foreground">Support & docs</span>
      </div>
    </div>
  </Example>
</template>
