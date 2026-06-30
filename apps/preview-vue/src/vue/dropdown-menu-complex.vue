<script setup lang="ts">
import { ref } from 'vue'
import BellIcon from "@material-symbols/svg-400/rounded/notifications.svg?component"
import CreditCardIcon from "@material-symbols/svg-400/rounded/credit_card.svg?component"
import DownloadIcon from "@material-symbols/svg-400/rounded/download.svg?component"
import EyeIcon from "@material-symbols/svg-400/rounded/visibility.svg?component"
import FileCodeIcon from "@material-symbols/svg-400/rounded/code.svg?component"
import FileIcon from "@material-symbols/svg-400/rounded/description.svg?component"
import FolderIcon from "@material-symbols/svg-400/rounded/folder.svg?component"
import FolderOpenIcon from "@material-symbols/svg-400/rounded/folder_open.svg?component"
import FolderSearchIcon from "@material-symbols/svg-400/rounded/folder.svg?component"
import HelpCircleIcon from "@material-symbols/svg-400/rounded/help.svg?component"
import FileTextIcon from "@material-symbols/svg-400/rounded/description.svg?component"
import KeyboardIcon from "@material-symbols/svg-400/rounded/keyboard.svg?component"
import LanguagesIcon from "@material-symbols/svg-400/rounded/translate.svg?component"
import LayoutIcon from "@material-symbols/svg-400/rounded/dashboard.svg?component"
import LogOutIcon from "@material-symbols/svg-400/rounded/logout.svg?component"
import MailIcon from "@material-symbols/svg-400/rounded/mail.svg?component"
import MonitorIcon from "@material-symbols/svg-400/rounded/monitor.svg?component"
import MoonIcon from "@material-symbols/svg-400/rounded/dark_mode.svg?component"
import MoreHorizontalIcon from "@material-symbols/svg-400/rounded/more_horiz.svg?component"
import PaletteIcon from "@material-symbols/svg-400/rounded/palette.svg?component"
import SaveIcon from "@material-symbols/svg-400/rounded/save.svg?component"
import SettingsIcon from "@material-symbols/svg-400/rounded/settings.svg?component"
import ShieldIcon from "@material-symbols/svg-400/rounded/shield.svg?component"
import SunIcon from "@material-symbols/svg-400/rounded/light_mode.svg?component"
import UserIcon from "@material-symbols/svg-400/rounded/person.svg?component"

import { Button } from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'

const notifications = ref({
  email: true,
  sms: false,
  push: true,
})
const theme = ref('light')
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">Complex Menu</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-44">
      <DropdownMenuGroup>
        <DropdownMenuLabel>File</DropdownMenuLabel>
        <DropdownMenuItem>
          <FileIcon />
          New File
          <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FolderIcon />
          New Folder
          <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <FolderOpenIcon />
            Open Recent
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
                <DropdownMenuItem>
                  <FileCodeIcon />
                  Project Alpha
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileCodeIcon />
                  Project Beta
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <MoreHorizontalIcon />
                    More Projects
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>
                        <FileCodeIcon />
                        Project Gamma
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileCodeIcon />
                        Project Delta
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <FolderSearchIcon />
                  Browse...
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SaveIcon />
          Save
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DownloadIcon />
          Export
          <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel>View</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          :checked="notifications.email"
          @update:checked="notifications.email = $event === true"
        >
          <EyeIcon />
          Show Sidebar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          :checked="notifications.sms"
          @update:checked="notifications.sms = $event === true"
        >
          <LayoutIcon />
          Show Status Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <PaletteIcon />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuRadioGroup :model-value="theme" @update:model-value="theme = $event as string">
                  <DropdownMenuRadioItem value="light">
                    <SunIcon />
                    Light
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    <MoonIcon />
                    Dark
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">
                    <MonitorIcon />
                    System
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem>
          <UserIcon />
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCardIcon />
          Billing
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <SettingsIcon />
            Settings
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                <DropdownMenuItem>
                  <KeyboardIcon />
                  Keyboard Shortcuts
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LanguagesIcon />
                  Language
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <BellIcon />
                    Notifications
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Notification Types</DropdownMenuLabel>
                        <DropdownMenuCheckboxItem
                          :checked="notifications.push"
                          @update:checked="notifications.push = $event === true"
                        >
                          <BellIcon />
                          Push Notifications
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          :checked="notifications.email"
                          @update:checked="notifications.email = $event === true"
                        >
                          <MailIcon />
                          Email Notifications
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <ShieldIcon />
                  Privacy &amp; Security
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <HelpCircleIcon />
          Help &amp; Support
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FileTextIcon />
          Documentation
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem variant="destructive">
          <LogOutIcon />
          Sign Out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
