<script setup lang="ts">
import BadgeCheckIcon from "@material-symbols/svg-400/rounded/verified.svg?component"
import BellIcon from "@material-symbols/svg-400/rounded/notifications.svg?component"
import CreditCardIcon from "@material-symbols/svg-400/rounded/credit_card.svg?component"
import LogOutIcon from "@material-symbols/svg-400/rounded/logout.svg?component"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/ui/avatar'
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
      <Button variant="ghost" size="icon" class="rounded-full">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
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
