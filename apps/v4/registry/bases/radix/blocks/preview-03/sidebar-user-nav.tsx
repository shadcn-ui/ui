"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/radix/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/registry/bases/radix/ui/sidebar"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export type SidebarUserNavUser = {
  name: string
  email: string
  avatar: string
}

export type SidebarUserNavProps = {
  user: SidebarUserNavUser
}

export function SidebarUserNav({ user }: SidebarUserNavProps) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              type="button"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name
                    .split(/\s+/)
                    .map((part) => {
                      return part[0]
                    })
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 gap-0.5 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <IconPlaceholder
                lucide="EllipsisVerticalIcon"
                tabler="IconDotsVertical"
                hugeicons="MoreVerticalCircle01Icon"
                phosphor="DotsThreeVerticalIcon"
                remixicon="RiMore2Line"
                className="ml-auto size-4"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-fit"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="SettingsIcon"
                  tabler="IconSettings"
                  hugeicons="SettingsIcon"
                  phosphor="GearIcon"
                  remixicon="RiSettingsLine"
                />
                Settings
                <DropdownMenuShortcut className="tracking-tighter">
                  ⇧⌘,
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <IconPlaceholder
                    lucide="GlobeIcon"
                    tabler="IconGlobe"
                    hugeicons="Globe02Icon"
                    phosphor="GlobeIcon"
                    remixicon="RiGlobeLine"
                  />
                  Language
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="min-w-44">
                  <DropdownMenuItem>English</DropdownMenuItem>
                  <DropdownMenuItem>Français</DropdownMenuItem>
                  <DropdownMenuItem>Español</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="CircleHelpIcon"
                  tabler="IconHelpCircle"
                  hugeicons="HelpCircleIcon"
                  phosphor="QuestionIcon"
                  remixicon="RiQuestionLine"
                />
                Get help
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="ListIcon"
                  tabler="IconListDetails"
                  hugeicons="LeftToRightListBulletIcon"
                  phosphor="ListIcon"
                  remixicon="RiListUnordered"
                />
                View all plans
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="DownloadIcon"
                  tabler="IconDownload"
                  hugeicons="DownloadIcon"
                  phosphor="DownloadIcon"
                  remixicon="RiDownloadLine"
                />
                Get apps and extensions
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="SparklesIcon"
                  tabler="IconSparkles"
                  hugeicons="SparklesIcon"
                  phosphor="SparkleIcon"
                  remixicon="RiSparklingLine"
                />
                Gift Claude
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <IconPlaceholder
                    lucide="InfoIcon"
                    tabler="IconInfoCircle"
                    hugeicons="InformationCircleIcon"
                    phosphor="InfoIcon"
                    remixicon="RiInformationLine"
                  />
                  Learn more
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="min-w-44">
                  <DropdownMenuItem>Documentation</DropdownMenuItem>
                  <DropdownMenuItem>Release notes</DropdownMenuItem>
                  <DropdownMenuItem>Privacy</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="LogOutIcon"
                tabler="IconLogout"
                hugeicons="Logout01Icon"
                phosphor="SignOutIcon"
                remixicon="RiLogoutBoxLine"
              />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
