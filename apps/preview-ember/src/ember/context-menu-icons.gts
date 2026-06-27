import ClipboardPasteIcon from '~icons/ms/content_paste';
import CopyIcon from '~icons/ms/content_copy';
import ScissorsIcon from '~icons/ms/content_cut';
import TrashIcon from '~icons/ms/delete';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
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
        <ContextMenuItem @variant="destructive">
          <TrashIcon />
          Delete
        </ContextMenuItem>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
</template>
