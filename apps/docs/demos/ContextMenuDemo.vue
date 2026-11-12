<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@saaze/ui'
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger
      class="flex min-h-40 w-full max-w-xl items-center justify-center rounded-md border border-dashed bg-background p-6 text-sm text-muted-foreground"
    >
      روی این ناحیه کلیک راست کنید
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuLabel>گزینه‌های سند</ContextMenuLabel>
      <ContextMenuSeparator />
      <ContextMenuItem>
        کپی
        <ContextMenuShortcut>⌘C</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem disabled>چسباندن</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>
