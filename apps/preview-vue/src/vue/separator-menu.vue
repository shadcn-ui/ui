<script setup lang="ts">
import { Separator } from '@/ui/separator'
</script>

<template>
  <div class="flex items-center gap-2 text-sm md:gap-4">
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
        Profile &amp; security
      </span>
    </div>
    <Separator orientation="vertical" class="hidden md:block" />
    <div class="hidden flex-col gap-1 md:flex">
      <span class="font-medium">Help</span>
      <span class="text-xs text-muted-foreground">Support &amp; docs</span>
    </div>
  </div>
</template>
