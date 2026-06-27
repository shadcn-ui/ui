import BadgeCheckIcon from '~icons/ms/verified';
import BellIcon from '~icons/ms/notifications';
import CreditCardIcon from '~icons/ms/credit_card';
import LogOutIcon from '~icons/ms/logout';

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
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent @align="end">
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <BadgeCheckIcon />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCardIcon />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem>
          <BellIcon />
          Notifications
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <LogOutIcon />
        Sign Out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
