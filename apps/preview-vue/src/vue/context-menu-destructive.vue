<script setup lang="ts">
import PencilIcon from "@material-symbols/svg-400/rounded/edit.svg?component"
import ShareIcon from "@material-symbols/svg-400/rounded/share.svg?component"
import TrashIcon from "@material-symbols/svg-400/rounded/delete.svg?component"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
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
        <ContextMenuItem>
          <PencilIcon />
          Edit
        </ContextMenuItem>
        <ContextMenuItem>
          <ShareIcon />
          Share
        </ContextMenuItem>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuItem variant="destructive">
          <TrashIcon />
          Delete
        </ContextMenuItem>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
</template>
