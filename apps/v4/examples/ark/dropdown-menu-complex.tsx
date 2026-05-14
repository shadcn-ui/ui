"use client"

import * as React from "react"
import { Button } from "@/examples/ark/ui/button"
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
} from "@/examples/ark/ui/dropdown-menu"
import {
  BellIcon,
  CreditCardIcon,
  DownloadIcon,
  EyeIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  FolderOpenIcon,
  FolderSearchIcon,
  HelpCircleIcon,
  KeyboardIcon,
  LanguagesIcon,
  LayoutIcon,
  LogOutIcon,
  MailIcon,
  MonitorIcon,
  MoonIcon,
  MoreHorizontalIcon,
  PaletteIcon,
  SaveIcon,
  SettingsIcon,
  ShieldIcon,
  SunIcon,
  UserIcon,
} from "lucide-react"

export function DropdownMenuComplex() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  })
  const [theme, setTheme] = React.useState("light")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Complex Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>File</DropdownMenuLabel>
          <DropdownMenuItem value="new-file">
            <FileIcon />
            New File
            <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem value="new-folder">
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
                  <DropdownMenuItem value="project-alpha">
                    <FileCodeIcon />
                    Project Alpha
                  </DropdownMenuItem>
                  <DropdownMenuItem value="project-beta">
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
                        <DropdownMenuItem value="project-gamma">
                          <FileCodeIcon />
                          Project Gamma
                        </DropdownMenuItem>
                        <DropdownMenuItem value="project-delta">
                          <FileCodeIcon />
                          Project Delta
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem value="browse">
                    <FolderSearchIcon />
                    Browse...
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem value="save">
            <SaveIcon />
            Save
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem value="export">
            <DownloadIcon />
            Export
            <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>View</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            value="show-sidebar"
            checked={notifications.email}
            onCheckedChange={(checked) =>
              setNotifications({ ...notifications, email: checked === true })
            }
          >
            <EyeIcon />
            Show Sidebar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            value="show-status-bar"
            checked={notifications.sms}
            onCheckedChange={(checked) =>
              setNotifications({ ...notifications, sms: checked === true })
            }
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
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(details) => setTheme(details.value)}
                  >
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
          <DropdownMenuItem value="profile">
            <UserIcon />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem value="billing">
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
                  <DropdownMenuItem value="keyboard-shortcuts">
                    <KeyboardIcon />
                    Keyboard Shortcuts
                  </DropdownMenuItem>
                  <DropdownMenuItem value="language">
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
                          <DropdownMenuLabel>
                            Notification Types
                          </DropdownMenuLabel>
                          <DropdownMenuCheckboxItem
                            value="push-notifications"
                            checked={notifications.push}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                push: checked === true,
                              })
                            }
                          >
                            <BellIcon />
                            Push Notifications
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            value="email-notifications"
                            checked={notifications.email}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                email: checked === true,
                              })
                            }
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
                  <DropdownMenuItem value="privacy-security">
                    <ShieldIcon />
                    Privacy & Security
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem value="help-support">
            <HelpCircleIcon />
            Help & Support
          </DropdownMenuItem>
          <DropdownMenuItem value="documentation">
            <FileTextIcon />
            Documentation
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem value="sign-out" variant="destructive">
            <LogOutIcon />
            Sign Out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
