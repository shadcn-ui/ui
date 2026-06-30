<script setup lang="ts">
import AlertTriangleIcon from "@material-symbols/svg-400/rounded/warning.svg?component"
import CheckIcon from "@material-symbols/svg-400/rounded/check.svg?component"
import ChevronDownIcon from "@material-symbols/svg-400/rounded/keyboard_arrow_down.svg?component"
import CopyIcon from "@material-symbols/svg-400/rounded/content_copy.svg?component"
import ShareIcon from "@material-symbols/svg-400/rounded/share.svg?component"
import TrashIcon from "@material-symbols/svg-400/rounded/delete.svg?component"
import UserRoundXIcon from "@material-symbols/svg-400/rounded/person_off.svg?component"
import VolumeOffIcon from "@material-symbols/svg-400/rounded/volume_off.svg?component"
import { Button } from '@/ui/button'
import { ButtonGroup } from '@/ui/button-group'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/ui/dropdown-menu'
</script>

<template>
  <ButtonGroup>
    <Button variant="outline">
      Follow
    </Button>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline" size="icon">
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="[--radius:1rem]">
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
          <DropdownMenuItem variant="destructive">
            <TrashIcon />
            Delete Conversation
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </ButtonGroup>
</template>
