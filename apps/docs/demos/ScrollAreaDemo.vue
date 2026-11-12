<script setup lang="ts">
import {
  ScrollArea,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from '@saaze/ui'
</script>

<template>
  <ScrollArea class="h-52 w-full max-w-sm rounded-md border bg-background" type="always">
    <ScrollAreaViewport class="p-4">
      <h4 class="mb-3 text-sm font-medium">یادداشت‌های پروژه</h4>
      <div class="grid gap-3 text-sm text-muted-foreground">
        <p v-for="index in 8" :key="index">
          بخش {{ index }} — محتوای پیمایش‌پذیر با نوار پیمایش قابل‌دسترس و سازگار با RTL.
        </p>
      </div>
    </ScrollAreaViewport>
    <ScrollAreaScrollbar orientation="vertical">
      <ScrollAreaThumb />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner />
  </ScrollArea>
</template>
