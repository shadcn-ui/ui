<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/ui/context-menu'
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
      Right click here
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuGroup>
        <ContextMenuItem>Back</ContextMenuItem>
        <ContextMenuItem :disabled="true">Forward</ContextMenuItem>
        <ContextMenuItem>Reload</ContextMenuItem>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
</template>
