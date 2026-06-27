import PencilIcon from '~icons/ms/edit';
import ShareIcon from '~icons/ms/share';
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
        <ContextMenuItem @variant="destructive">
          <TrashIcon />
          Delete
        </ContextMenuItem>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
</template>
