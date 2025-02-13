"use client"

import React from "react"
import {
  BellDotIcon,
  ClipboardListIcon,
  FolderIcon,
  FoldersIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  MessagesSquareIcon,
  PieChartIcon,
  SettingsIcon,
  Users2Icon,
} from "lucide-react"

import { AppSidebarHeader } from "@/registry/new-york/blocks/chat-01/components/app-sidebar-header"
import { FooterNavigation } from "@/registry/new-york/blocks/chat-01/components/footer-navigation"
import { MainNavigation } from "@/registry/new-york/blocks/chat-01/components/main-navigation"
import { SecondaryNavigation } from "@/registry/new-york/blocks/chat-01/components/secondary-navigation"
import { UserButton } from "@/registry/new-york/blocks/chat-01/components/user-button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/registry/new-york/ui/sidebar"

const data = {
  mainNavigation: {
    title: "General",
    href: "#",
    items: [
      {
        title: "Home",
        href: "#",
        isActive: false,
        icon: HomeIcon,
      },
      {
        title: "Dashboard",
        href: "#",
        isActive: false,
        icon: LayoutDashboardIcon,
      },
      {
        title: "Projects",
        href: "#",
        isActive: false,
        icon: FoldersIcon,
      },
      {
        title: "Tasks",
        href: "#",
        isActive: false,
        icon: ClipboardListIcon,
        count: 10,
      },
      {
        title: "Reporting",
        href: "#",
        isActive: false,
        icon: PieChartIcon,
      },
      {
        title: "Users",
        href: "#",
        isActive: false,
        icon: Users2Icon,
      },
      {
        title: "Messages",
        href: "#",
        isActive: true,
        icon: MessagesSquareIcon,
        count: 20,
      },
    ],
  },
  secondNavigation: [
    {
      title: "Projects",
      href: "#",
      icon: FoldersIcon,
      isActive: true,
      items: [
        {
          title: "Project A",
          href: "#",
          isActive: false,
          icon: FolderIcon,
        },
        {
          title: "Project B",
          href: "#",
          isActive: false,
          icon: FolderIcon,
        },
        {
          title: "Project C",
          href: "#",
          isActive: false,
          icon: FolderIcon,
        },
        {
          title: "Project D",
          href: "#",
          isActive: false,
          icon: FolderIcon,
        },
        {
          title: "Project E",
          href: "#",
          isActive: false,
          icon: FolderIcon,
        },
        {
          title: "Other",
          href: "#",
          isActive: false,
          icon: FolderIcon,
        },
      ],
    },
  ],
  footerNavigation: {
    title: "Settings",
    href: "#",
    items: [
      {
        title: "Notifications",
        href: "#",
        isActive: false,
        icon: BellDotIcon,
        count: 4,
      },
      {
        title: "Settings",
        href: "#",
        isActive: false,
        icon: SettingsIcon,
      },
      {
        title: "Support",
        href: "#",
        isActive: false,
        icon: LifeBuoyIcon,
      },
    ],
  },
}

export function AppSidebar() {
  return (
    <Sidebar>
      <AppSidebarHeader />
      <SidebarContent>
        <MainNavigation items={data.mainNavigation.items} />
        <SecondaryNavigation items={data.secondNavigation} />
      </SidebarContent>
      <SidebarFooter>
        <FooterNavigation items={data.footerNavigation.items} />
        <UserButton />
      </SidebarFooter>
    </Sidebar>
  )
}
