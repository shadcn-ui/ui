"use client"

import * as React from "react"

import { NavMain } from "@/registry/bases/base/blocks/sidebar-08/components/nav-main"
import { NavProjects } from "@/registry/bases/base/blocks/sidebar-08/components/nav-projects"
import { NavSecondary } from "@/registry/bases/base/blocks/sidebar-08/components/nav-secondary"
import { NavUser } from "@/registry/bases/base/blocks/sidebar-08/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/bases/base/ui/sidebar"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="TerminalSquareIcon"
          tabler="IconTerminal2"
          hugeicons="ComputerTerminalIcon"
          phosphor="TerminalIcon"
          remixicon="RiTerminalBoxLine"
        />
      ),
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="BotIcon"
          tabler="IconRobot"
          hugeicons="RoboticIcon"
          phosphor="RobotIcon"
          remixicon="RiRobotLine"
        />
      ),
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="BookOpenIcon"
          tabler="IconBook"
          hugeicons="BookOpen02Icon"
          phosphor="BookOpenIcon"
          remixicon="RiBookOpenLine"
        />
      ),
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
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
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="LifeBuoyIcon"
          tabler="IconLifebuoy"
          hugeicons="ChartRingIcon"
          phosphor="LifebuoyIcon"
          remixicon="RiLifebuoyLine"
        />
      ),
    },
    {
      title: "Feedback",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="SendIcon"
          tabler="IconSend"
          hugeicons="SentIcon"
          phosphor="PaperPlaneTiltIcon"
          remixicon="RiSendPlaneLine"
        />
      ),
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="FrameIcon"
          tabler="IconFrame"
          hugeicons="CropIcon"
          phosphor="CropIcon"
          remixicon="RiCropLine"
        />
      ),
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="PieChartIcon"
          tabler="IconChartPie"
          hugeicons="PieChartIcon"
          phosphor="ChartPieIcon"
          remixicon="RiPieChartLine"
        />
      ),
    },
    {
      name: "Travel",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="MapIcon"
          tabler="IconMap"
          hugeicons="MapsIcon"
          phosphor="MapTrifoldIcon"
          remixicon="RiMapLine"
        />
      ),
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <IconPlaceholder
                  lucide="TerminalIcon"
                  tabler="IconCommand"
                  hugeicons="CommandIcon"
                  phosphor="CommandIcon"
                  remixicon="RiCommandLine"
                  className="size-4"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Acme Inc</span>
                <span className="truncate text-xs">Enterprise</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
