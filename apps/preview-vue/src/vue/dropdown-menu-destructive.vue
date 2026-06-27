<script setup lang="ts">
import PencilIcon from "@material-symbols/svg-400/rounded/edit.svg?component"
import ShareIcon from "@material-symbols/svg-400/rounded/share.svg?component"
import TrashIcon from "@material-symbols/svg-400/rounded/delete.svg?component"

import { Button } from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">Actions</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <PencilIcon />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ShareIcon />
          Share
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem variant="destructive">
          <TrashIcon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
