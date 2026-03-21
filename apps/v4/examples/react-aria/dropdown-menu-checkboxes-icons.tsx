"use client"

import * as React from "react"
import { Button } from "@/examples/react-aria/ui/button"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/examples/react-aria/ui/dropdown-menu"
import { BellIcon, MailIcon, MessageSquareIcon } from "lucide-react"
import type {Selection} from 'react-aria-components'

export function DropdownMenuCheckboxesIcons() {
  const [notifications, setNotifications] = React.useState<Selection>(new Set(['email', 'push']))

  return (
    <DropdownMenuTrigger>
      <Button variant="outline">
        Notifications
      </Button>
      <DropdownMenu className="w-48">
        <DropdownMenuGroup selectionMode="multiple" selectedKeys={notifications} onSelectionChange={setNotifications}>
          <DropdownMenuLabel>Notification Preferences</DropdownMenuLabel>
          <DropdownMenuItem id="email">
            <MailIcon />
            Email notifications
          </DropdownMenuItem>
          <DropdownMenuItem id="sms">
            <MessageSquareIcon />
            SMS notifications
          </DropdownMenuItem>
          <DropdownMenuItem id="push">
            <BellIcon />
            Push notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenu>
    </DropdownMenuTrigger>
  )
}
