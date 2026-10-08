"use client"

import * as React from "react"

import { Button } from "@/registry/bases/base/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/base/ui/popover"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/bases/base/ui/sidebar"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const data = [
  [
    {
      label: "Customize Page",
      icon: (
        <IconPlaceholder
          lucide="Settings2Icon"
          tabler="IconSettings"
          hugeicons="Settings05Icon"
          phosphor="GearIcon"
          remixicon="RiSettingsLine"
        />
      ),
    },
    {
      label: "Turn into wiki",
      icon: (
        <IconPlaceholder
          lucide="FileTextIcon"
          tabler="IconFileText"
          hugeicons="File01Icon"
          phosphor="FileTextIcon"
          remixicon="RiFileTextLine"
        />
      ),
    },
  ],
  [
    {
      label: "Copy Link",
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
      label: "Duplicate",
      icon: (
        <IconPlaceholder
          lucide="CopyIcon"
          tabler="IconCopy"
          hugeicons="Copy01Icon"
          phosphor="CopyIcon"
          remixicon="RiFileCopyLine"
        />
      ),
    },
    {
      label: "Move to",
      icon: (
        <IconPlaceholder
          lucide="CornerUpRightIcon"
          tabler="IconCornerUpRight"
          hugeicons="RedoIcon"
          phosphor="ArrowBendUpRightIcon"
          remixicon="RiCornerUpRightLine"
        />
      ),
    },
    {
      label: "Move to Trash",
      icon: (
        <IconPlaceholder
          lucide="Trash2Icon"
          tabler="IconTrash"
          hugeicons="Delete02Icon"
          phosphor="TrashIcon"
          remixicon="RiDeleteBinLine"
        />
      ),
    },
  ],
  [
    {
      label: "Undo",
      icon: (
        <IconPlaceholder
          lucide="CornerUpLeftIcon"
          tabler="IconCornerUpLeft"
          hugeicons="UndoIcon"
          phosphor="ArrowBendUpLeftIcon"
          remixicon="RiCornerUpLeftLine"
        />
      ),
    },
    {
      label: "View analytics",
      icon: (
        <IconPlaceholder
          lucide="ChartLineIcon"
          tabler="IconChartLine"
          hugeicons="ChartIcon"
          phosphor="ChartLineIcon"
          remixicon="RiLineChartLine"
        />
      ),
    },
    {
      label: "Version History",
      icon: (
        <IconPlaceholder
          lucide="GalleryVerticalEndIcon"
          tabler="IconLayoutRows"
          hugeicons="LayoutBottomIcon"
          phosphor="RowsIcon"
          remixicon="RiGalleryLine"
        />
      ),
    },
    {
      label: "Show delete pages",
      icon: (
        <IconPlaceholder
          lucide="TrashIcon"
          tabler="IconTrash"
          hugeicons="DeleteIcon"
          phosphor="TrashIcon"
          remixicon="RiDeleteBinLine"
        />
      ),
    },
    {
      label: "Notifications",
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
  ],
  [
    {
      label: "Import",
      icon: (
        <IconPlaceholder
          lucide="ArrowUpIcon"
          tabler="IconArrowUp"
          hugeicons="ArrowUpIcon"
          phosphor="ArrowUpIcon"
          remixicon="RiArrowUpLine"
        />
      ),
    },
    {
      label: "Export",
      icon: (
        <IconPlaceholder
          lucide="ArrowDownIcon"
          tabler="IconArrowDown"
          hugeicons="ArrowDownIcon"
          phosphor="ArrowDownIcon"
          remixicon="RiArrowDownLine"
        />
      ),
    },
  ],
]
export function NavActions() {
  const [isOpen, setIsOpen] = React.useState(false)
  React.useEffect(() => {
    setIsOpen(true)
  }, [])
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="hidden font-medium text-muted-foreground md:inline-block">
        Edit Oct 08
      </div>
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <IconPlaceholder
          lucide="StarIcon"
          tabler="IconStar"
          hugeicons="StarIcon"
          phosphor="StarIcon"
          remixicon="RiStarLine"
        />
      </Button>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 data-open:bg-accent"
            />
          }
        >
          <IconPlaceholder
            lucide="MoreHorizontalIcon"
            tabler="IconDots"
            hugeicons="MoreHorizontalCircle01Icon"
            phosphor="DotsThreeOutlineIcon"
            remixicon="RiMoreLine"
          />
        </PopoverTrigger>
        <PopoverContent
          className="w-56 overflow-hidden rounded-lg p-0"
          align="end"
        >
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              {data.map((group, index) => (
                <SidebarGroup key={index} className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, index) => (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton>
                            {item.icon} <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  )
}
