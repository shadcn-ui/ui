import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/ember-ui/context-menu';

<template>
  <ContextMenu>
    <ContextMenuTrigger>
      <div class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
        Right click here
      </div>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuGroup>
        <ContextMenuItem>Back</ContextMenuItem>
        <ContextMenuItem @disabled={{true}}>Forward</ContextMenuItem>
        <ContextMenuItem>Reload</ContextMenuItem>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
</template>
