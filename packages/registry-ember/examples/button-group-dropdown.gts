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

import AlertTriangleIcon from '~icons/ms/warning';
import CheckIcon from '~icons/ms/check';
import ChevronDownIcon from '~icons/ms/keyboard_arrow_down';
import CopyIcon from '~icons/ms/content_copy';
import ShareIcon from '~icons/ms/share';
import TrashIcon from '~icons/ms/delete';
import UserRoundXIcon from '~icons/ms/person_off';
import VolumeOffIcon from '~icons/ms/volume_off';

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
