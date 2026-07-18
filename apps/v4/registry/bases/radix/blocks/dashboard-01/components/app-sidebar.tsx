"use client"

import * as React from "react"

import { NavDocuments } from "@/registry/bases/radix/blocks/dashboard-01/components/nav-documents"
import { NavMain } from "@/registry/bases/radix/blocks/dashboard-01/components/nav-main"
import { NavSecondary } from "@/registry/bases/radix/blocks/dashboard-01/components/nav-secondary"
import { NavUser } from "@/registry/bases/radix/blocks/dashboard-01/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/bases/radix/ui/sidebar"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="LayoutDashboardIcon"
          tabler="IconDashboard"
          hugeicons="DashboardSquare01Icon"
          phosphor="SquaresFourIcon"
          remixicon="RiDashboardLine"
        />
      ),
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="ListIcon"
          tabler="IconListDetails"
          hugeicons="Menu01Icon"
          phosphor="ListIcon"
          remixicon="RiListUnordered"
        />
      ),
    },
    {
      title: "Analytics",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="ChartBarIcon"
          tabler="IconChartBar"
          hugeicons="ChartHistogramIcon"
          phosphor="ChartBarIcon"
          remixicon="RiBarChartLine"
        />
      ),
    },
    {
      title: "Projects",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="FolderIcon"
          tabler="IconFolder"
          hugeicons="Folder01Icon"
          phosphor="FolderIcon"
          remixicon="RiFolderLine"
        />
      ),
    },
    {
      title: "Team",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="UsersIcon"
          tabler="IconUsers"
          hugeicons="UserGroupIcon"
          phosphor="UsersIcon"
          remixicon="RiGroupLine"
        />
      ),
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: (
        <IconPlaceholder
          lucide="CameraIcon"
          tabler="IconCamera"
          hugeicons="Camera01Icon"
          phosphor="CameraIcon"
          remixicon="RiCameraLine"
        />
      ),
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: (
        <IconPlaceholder
          lucide="FileTextIcon"
          tabler="IconFileDescription"
          hugeicons="File01Icon"
          phosphor="FileTextIcon"
          remixicon="RiFileTextLine"
        />
      ),
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: (
        <IconPlaceholder
          lucide="FileTextIcon"
          tabler="IconFileAi"
          hugeicons="File01Icon"
          phosphor="FileTextIcon"
          remixicon="RiFileTextLine"
        />
      ),
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
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
      title: "Get Help",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="CircleHelpIcon"
          tabler="IconHelp"
          hugeicons="HelpCircleIcon"
          phosphor="QuestionIcon"
          remixicon="RiQuestionLine"
        />
      ),
    },
    {
      title: "Search",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="SearchIcon"
          tabler="IconSearch"
          hugeicons="SearchIcon"
          phosphor="MagnifyingGlassIcon"
          remixicon="RiSearchLine"
        />
      ),
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="DatabaseIcon"
          tabler="IconDatabase"
          hugeicons="Database01Icon"
          phosphor="DatabaseIcon"
          remixicon="RiDatabase2Line"
        />
      ),
    },
    {
      name: "Reports",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="FileChartColumnIcon"
          tabler="IconReport"
          hugeicons="Analytics01Icon"
          phosphor="ChartLineIcon"
          remixicon="RiFileChartLine"
        />
      ),
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="FileIcon"
          tabler="IconFileWord"
          hugeicons="File01Icon"
          phosphor="FileIcon"
          remixicon="RiFileLine"
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <IconPlaceholder
                  lucide="CommandIcon"
                  tabler="IconInnerShadowTop"
                  hugeicons="CommandIcon"
                  phosphor="CommandIcon"
                  remixicon="RiCommandLine"
                  className="size-5!"
                />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
