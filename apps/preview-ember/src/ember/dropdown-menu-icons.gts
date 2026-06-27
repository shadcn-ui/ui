import CreditCardIcon from '~icons/ms/credit_card';
import LogOutIcon from '~icons/ms/logout';
import SettingsIcon from '~icons/ms/settings';
import UserIcon from '~icons/ms/person';

import { Button } from '@/ember-ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ember-ui/dropdown-menu';

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button @variant="outline">Open</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>
        <UserIcon />
        Profile
      </DropdownMenuItem>
      <DropdownMenuItem>
        <CreditCardIcon />
        Billing
      </DropdownMenuItem>
      <DropdownMenuItem>
        <SettingsIcon />
        Settings
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @variant="destructive">
        <LogOutIcon />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
