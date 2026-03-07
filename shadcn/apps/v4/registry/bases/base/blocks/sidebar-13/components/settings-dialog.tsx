"use client"

import * as React from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/bases/base/ui/breadcrumb"
import { Button } from "@/registry/bases/base/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/base/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/registry/bases/base/ui/sidebar"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const data = {
  nav: [
    {
      name: "Notifications",
      icon: (
        <IconPlaceholder
          lucide="BellIcon"
          tabler="IconBell"
          hugeicons="NotificationIcon"
          phosphor="BellIcon"
          remixicon="RiNotificationLine"
        />
      ),
    },
    {
      name: "Navigation",
      icon: (
        <IconPlaceholder
          lucide="MenuIcon"
          tabler="IconMenu"
          hugeicons="Menu09Icon"
          phosphor="ListIcon"
          remixicon="RiMenuLine"
        />
      ),
    },
    {
      name: "Home",
      icon: (
        <IconPlaceholder
          lucide="HomeIcon"
          tabler="IconHome"
          hugeicons="HomeIcon"
          phosphor="HouseIcon"
          remixicon="RiHomeLine"
        />
      ),
    },
    {
      name: "Appearance",
      icon: (
        <IconPlaceholder
          lucide="PaintbrushIcon"
          tabler="IconPalette"
          hugeicons="PaintBoardIcon"
          phosphor="PaletteIcon"
          remixicon="RiPaletteLine"
        />
      ),
    },
    {
      name: "Messages & media",
      icon: (
        <IconPlaceholder
          lucide="MessageCircleIcon"
          tabler="IconMessageQuestion"
          hugeicons="MessageIcon"
          phosphor="ChatCircleIcon"
          remixicon="RiChat1Line"
        />
      ),
    },
    {
      name: "Language & region",
      icon: (
        <IconPlaceholder
          lucide="GlobeIcon"
          tabler="IconWorld"
          hugeicons="Globe02Icon"
          phosphor="GlobeIcon"
          remixicon="RiGlobalLine"
        />
      ),
    },
    {
      name: "Accessibility",
      icon: (
        <IconPlaceholder
          lucide="KeyboardIcon"
          tabler="IconKeyboard"
          hugeicons="KeyboardIcon"
          phosphor="KeyboardIcon"
          remixicon="RiKeyboardLine"
        />
      ),
    },
    {
      name: "Mark as read",
      icon: (
        <IconPlaceholder
          lucide="CheckIcon"
          tabler="IconCheck"
          hugeicons="Tick02Icon"
          phosphor="CheckIcon"
          remixicon="RiCheckLine"
        />
      ),
    },
    {
      name: "Audio & video",
      icon: (
        <IconPlaceholder
          lucide="VideoIcon"
          tabler="IconVideoPlus"
          hugeicons="RecordIcon"
          phosphor="VideoIcon"
          remixicon="RiVideoLine"
        />
      ),
    },
    {
      name: "Connected accounts",
      icon: (
        <IconPlaceholder
          lucide="LinkIcon"
          tabler="IconLink"
          hugeicons="LinkIcon"
          phosphor="LinkIcon"
          remixicon="RiLinksLine"
        />
      ),
    },
    {
      name: "Privacy & visibility",
      icon: (
        <IconPlaceholder
          lucide="LockIcon"
          tabler="IconLock"
          hugeicons="ShieldIcon"
          phosphor="LockIcon"
          remixicon="RiLockLine"
        />
      ),
    },
    {
      name: "Advanced",
      icon: (
        <IconPlaceholder
          lucide="SettingsIcon"
          tabler="IconSettings"
          hugeicons="SettingsIcon"
          phosphor="GearIcon"
          remixicon="RiSettingsLine"
        />
      ),
    },
  ],
}

export function SettingsDialog() {
  const [open, setOpen] = React.useState(true)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>Open Dialog</DialogTrigger>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          isActive={item.name === "Messages & media"}
                          render={<a href="#" />}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Messages & media</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {Array.from({
                length: 10,
              }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-video max-w-3xl rounded-xl bg-muted/50"
                />
              ))}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
