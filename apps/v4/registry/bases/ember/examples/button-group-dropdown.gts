import { Button } from '@/ui/button';
import { ButtonGroup } from '@/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';

import AlertTriangleIcon from '~icons/lucide/alert-triangle';
import CheckIcon from '~icons/lucide/check';
import ChevronDownIcon from '~icons/lucide/chevron-down';
import CopyIcon from '~icons/lucide/copy';
import ShareIcon from '~icons/lucide/share';
import TrashIcon from '~icons/lucide/trash';
import UserRoundXIcon from '~icons/lucide/user-round-x';
import VolumeOffIcon from '~icons/lucide/volume-off';

<template>
  <ButtonGroup>
    <Button @variant="outline">Follow</Button>
    <DropdownMenu>
      <DropdownMenuTrigger @asChild={{true}} as |trigger|>
        <Button @variant="outline" class="!pl-2" {{trigger.modifiers}}>
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent @class="[--radius:1rem]">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <VolumeOffIcon />
            Mute Conversation
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CheckIcon />
            Mark as Read
          </DropdownMenuItem>
          <DropdownMenuItem>
            <AlertTriangleIcon />
            Report Conversation
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserRoundXIcon />
            Block User
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShareIcon />
            Share Conversation
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon />
            Copy Conversation
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem @variant="destructive">
            <TrashIcon />
            Delete Conversation
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </ButtonGroup>
</template>
