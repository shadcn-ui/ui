<script setup lang="ts">
import { ref } from 'vue'
import BellIcon from "@material-symbols/svg-400/rounded/notifications.svg?component"
import MailIcon from "@material-symbols/svg-400/rounded/mail.svg?component"
import MessageSquareIcon from "@material-symbols/svg-400/rounded/chat.svg?component"

import { Button } from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'

const notifications = ref({
  email: true,
  sms: false,
  push: true,
})
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">Notifications</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-48">
      <DropdownMenuGroup>
        <DropdownMenuLabel>Notification Preferences</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          :checked="notifications.email"
          @update:checked="notifications.email = $event === true"
        >
          <MailIcon />
          Email notifications
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          :checked="notifications.sms"
          @update:checked="notifications.sms = $event === true"
        >
          <MessageSquareIcon />
          SMS notifications
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          :checked="notifications.push"
          @update:checked="notifications.push = $event === true"
        >
          <BellIcon />
          Push notifications
        </DropdownMenuCheckboxItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
