"use client"

import * as React from "react"

import { NavFavorites } from "@/registry/bases/ark/blocks/sidebar-10/components/nav-favorites"
import { NavMain } from "@/registry/bases/ark/blocks/sidebar-10/components/nav-main"
import { NavSecondary } from "@/registry/bases/ark/blocks/sidebar-10/components/nav-secondary"
import { NavWorkspaces } from "@/registry/bases/ark/blocks/sidebar-10/components/nav-workspaces"
import { TeamSwitcher } from "@/registry/bases/ark/blocks/sidebar-10/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/registry/bases/ark/ui/sidebar"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: (
        <IconPlaceholder
          lucide="TerminalIcon"
          tabler="IconCommand"
          hugeicons="CommandIcon"
          phosphor="CommandIcon"
          remixicon="RiCommandLine"
        />
      ),
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: (
        <IconPlaceholder
          lucide="AudioLinesIcon"
          tabler="IconWaveSine"
          hugeicons="AudioWave01Icon"
          phosphor="WaveformIcon"
          remixicon="RiPulseLine"
        />
      ),
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: (
        <IconPlaceholder
          lucide="TerminalIcon"
          tabler="IconCommand"
          hugeicons="CommandIcon"
          phosphor="CommandIcon"
          remixicon="RiCommandLine"
        />
      ),
      plan: "Free",
    },
  ],
  navMain: [
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
    {
      title: "Ask AI",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="SparklesIcon"
          tabler="IconSparkles"
          hugeicons="SparklesIcon"
          phosphor="SparkleIcon"
          remixicon="RiSparklingLine"
        />
      ),
    },
    {
      title: "Home",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="HomeIcon"
          tabler="IconHome"
          hugeicons="HomeIcon"
          phosphor="HouseIcon"
          remixicon="RiHomeLine"
        />
      ),
      isActive: true,
    },
    {
      title: "Inbox",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="InboxIcon"
          tabler="IconInbox"
          hugeicons="InboxIcon"
          phosphor="TrayIcon"
          remixicon="RiInboxLine"
        />
      ),
      badge: "10",
    },
  ],
  navSecondary: [
    {
      title: "Calendar",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="CalendarIcon"
          tabler="IconCalendar"
          hugeicons="CalendarIcon"
          phosphor="CalendarIcon"
          remixicon="RiCalendarLine"
        />
      ),
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
    },
    {
      title: "Templates",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="BlocksIcon"
          tabler="IconCube"
          hugeicons="CubeIcon"
          phosphor="CubeIcon"
          remixicon="RiBox3Line"
        />
      ),
    },
    {
      title: "Trash",
      url: "#",
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
    {
      title: "Help",
      url: "#",
      icon: (
        <IconPlaceholder
          lucide="MessageCircleQuestionIcon"
          tabler="IconMessageQuestion"
          hugeicons="MessageQuestionIcon"
          phosphor="ChatCircleIcon"
          remixicon="RiQuestionLine"
        />
      ),
    },
  ],
  favorites: [
    {
      name: "Project Management & Task Tracking",
      url: "#",
      emoji: "📊",
    },
    {
      name: "Family Recipe Collection & Meal Planning",
      url: "#",
      emoji: "🍳",
    },
    {
      name: "Fitness Tracker & Workout Routines",
      url: "#",
      emoji: "💪",
    },
    {
      name: "Book Notes & Reading List",
      url: "#",
      emoji: "📚",
    },
    {
      name: "Sustainable Gardening Tips & Plant Care",
      url: "#",
      emoji: "🌱",
    },
    {
      name: "Language Learning Progress & Resources",
      url: "#",
      emoji: "🗣️",
    },
    {
      name: "Home Renovation Ideas & Budget Tracker",
      url: "#",
      emoji: "🏠",
    },
    {
      name: "Personal Finance & Investment Portfolio",
      url: "#",
      emoji: "💰",
    },
    {
      name: "Movie & TV Show Watchlist with Reviews",
      url: "#",
      emoji: "🎬",
    },
    {
      name: "Daily Habit Tracker & Goal Setting",
      url: "#",
      emoji: "✅",
    },
  ],
  workspaces: [
    {
      name: "Personal Life Management",
      emoji: "🏠",
      pages: [
        {
          name: "Daily Journal & Reflection",
          url: "#",
          emoji: "📔",
        },
        {
          name: "Health & Wellness Tracker",
          url: "#",
          emoji: "🍏",
        },
        {
          name: "Personal Growth & Learning Goals",
          url: "#",
          emoji: "🌟",
        },
      ],
    },
    {
      name: "Professional Development",
      emoji: "💼",
      pages: [
        {
          name: "Career Objectives & Milestones",
          url: "#",
          emoji: "🎯",
        },
        {
          name: "Skill Acquisition & Training Log",
          url: "#",
          emoji: "🧠",
        },
        {
          name: "Networking Contacts & Events",
          url: "#",
          emoji: "🤝",
        },
      ],
    },
    {
      name: "Creative Projects",
      emoji: "🎨",
      pages: [
        {
          name: "Writing Ideas & Story Outlines",
          url: "#",
          emoji: "✍️",
        },
        {
          name: "Art & Design Portfolio",
          url: "#",
          emoji: "🖼️",
        },
        {
          name: "Music Composition & Practice Log",
          url: "#",
          emoji: "🎵",
        },
      ],
    },
    {
      name: "Home Management",
      emoji: "🏡",
      pages: [
        {
          name: "Household Budget & Expense Tracking",
          url: "#",
          emoji: "💰",
        },
        {
          name: "Home Maintenance Schedule & Tasks",
          url: "#",
          emoji: "🔧",
        },
        {
          name: "Family Calendar & Event Planning",
          url: "#",
          emoji: "📅",
        },
      ],
    },
    {
      name: "Travel & Adventure",
      emoji: "🧳",
      pages: [
        {
          name: "Trip Planning & Itineraries",
          url: "#",
          emoji: "🗺️",
        },
        {
          name: "Travel Bucket List & Inspiration",
          url: "#",
          emoji: "🌎",
        },
        {
          name: "Travel Journal & Photo Gallery",
          url: "#",
          emoji: "📸",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={data.favorites} />
        <NavWorkspaces workspaces={data.workspaces} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
