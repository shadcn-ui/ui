import { Button } from '@/ember-ui/button';
import { ButtonGroup } from '@/ember-ui/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ember-ui/dropdown-menu';

import AlertTriangleIcon from '~icons/material-symbols/warning-outline-rounded';
import CheckIcon from '~icons/material-symbols/check-rounded';
import ChevronDownIcon from '~icons/material-symbols/keyboard-arrow-down-rounded';
import CopyIcon from '~icons/material-symbols/content-copy-outline-rounded';
import ShareIcon from '~icons/material-symbols/share';
import TrashIcon from '~icons/material-symbols/delete-outline-rounded';
import UserRoundXIcon from '~icons/material-symbols/person-off-outline-rounded';
import VolumeOffIcon from '~icons/material-symbols/volume-off-outline-rounded';

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
