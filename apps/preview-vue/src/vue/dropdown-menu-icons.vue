<script setup lang="ts">
import CreditCardIcon from "@material-symbols/svg-400/rounded/credit_card.svg?component"
import LogOutIcon from "@material-symbols/svg-400/rounded/logout.svg?component"
import SettingsIcon from "@material-symbols/svg-400/rounded/settings.svg?component"
import UserIcon from "@material-symbols/svg-400/rounded/person.svg?component"

import { Button } from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">Open</Button>
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
      <DropdownMenuItem variant="destructive">
        <LogOutIcon />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
