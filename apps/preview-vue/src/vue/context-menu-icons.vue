<script setup lang="ts">
import ClipboardPasteIcon from "@material-symbols/svg-400/rounded/content_paste.svg?component"
import CopyIcon from "@material-symbols/svg-400/rounded/content_copy.svg?component"
import ScissorsIcon from "@material-symbols/svg-400/rounded/content_cut.svg?component"
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
          <CopyIcon />
          Copy
        </ContextMenuItem>
        <ContextMenuItem>
          <ScissorsIcon />
          Cut
        </ContextMenuItem>
        <ContextMenuItem>
          <ClipboardPasteIcon />
          Paste
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
