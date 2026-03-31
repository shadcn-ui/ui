<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/ui/context-menu"
import { Example } from "@/components"
</script>

<template>
  <Example title="With Icons">
    <ContextMenu>
      <ContextMenuTrigger class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            <IconPlaceholder
              lucide="CopyIcon"
              tabler="IconCopy"
              hugeicons="CopyIcon"
              phosphor="CopyIcon"
              remixicon="RiFileCopyLine"
            />
            Copy
          </ContextMenuItem>
          <ContextMenuItem>
            <IconPlaceholder
              lucide="ScissorsIcon"
              tabler="IconCut"
              hugeicons="ScissorIcon"
              phosphor="ScissorsIcon"
              remixicon="RiScissorsCutLine"
            />
            Cut
          </ContextMenuItem>
          <ContextMenuItem>
            <IconPlaceholder
              lucide="ClipboardPasteIcon"
              tabler="IconClipboard"
              hugeicons="ClipboardIcon"
              phosphor="ClipboardIcon"
              remixicon="RiClipboardLine"
            />
            Paste
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem variant="destructive">
            <IconPlaceholder
              lucide="TrashIcon"
              tabler="IconTrash"
              hugeicons="DeleteIcon"
              phosphor="TrashIcon"
              remixicon="RiDeleteBinLine"
            />
            Delete
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  </Example>
</template>
