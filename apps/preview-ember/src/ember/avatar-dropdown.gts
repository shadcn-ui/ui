import { Avatar, AvatarFallback, AvatarImage } from '@/ember-ui/avatar';
import { Button } from '@/ember-ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ember-ui/dropdown-menu';

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button @variant="ghost" @size="icon" @class="rounded-full">
        <Avatar>
          <AvatarImage @src="https://github.com/shadcn.png" @alt="shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent @class="w-32">
      <DropdownMenuGroup>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem @variant="destructive">Log out</DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
