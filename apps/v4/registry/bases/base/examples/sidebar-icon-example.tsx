"use client"

import * as React from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/bases/base/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/base/ui/item"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/registry/bases/base/ui/sidebar"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function SidebarIconExample() {
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Acme Inc",
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        plan: "Free",
      },
    ],
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
            lucide="BookOpen"
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

  const [activeTeam, setActiveTeam] = React.useState(data.teams[0])

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                    />
                  }
                >
                  <Button
                    size="icon-sm"
                    render={<span />}
                    nativeButton={false}
                    className="size-8"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 256 256"
                    >
                      <rect width="256" height="256" fill="none"></rect>
                      <line
                        x1="208"
                        y1="128"
                        x2="128"
                        y2="208"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="32"
                      ></line>
                      <line
                        x1="192"
                        y1="40"
                        x2="40"
                        y2="192"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="32"
                      ></line>
                    </svg>
                  </Button>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {activeTeam.name}
                    </span>
                    <span className="truncate text-xs">{activeTeam.plan}</span>
                  </div>
                  <IconPlaceholder
                    lucide="ChevronsUpDownIcon"
                    tabler="IconSelector"
                    hugeicons="UnfoldMoreIcon"
                    phosphor="CaretUpDownIcon"
                    remixicon="RiArrowUpDownLine"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Teams</DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    {data.teams.map((team) => (
                      <DropdownMenuItem
                        key={team.name}
                        onClick={() => setActiveTeam(team)}
                      >
                        {team.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                  render={<SidebarMenuItem />}
                >
                  <SidebarMenuButton
                    tooltip={item.title}
                    render={<CollapsibleTrigger />}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                    <IconPlaceholder
                      lucide="ChevronRightIcon"
                      tabler="IconChevronRight"
                      hugeicons="ArrowRight01Icon"
                      phosphor="CaretRightIcon"
                      remixicon="RiArrowRightSLine"
                      className="ml-auto transition-transform duration-100 group-data-open/collapsible:rotate-90"
                    />
                  </SidebarMenuButton>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            render={<a href={subItem.url} />}
                          >
                            {subItem.title}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarMenu>
              {data.projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton render={<a href={item.url} />}>
                    {item.icon}
                    {item.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                    />
                  }
                >
                  <Avatar>
                    <AvatarImage src={data.user.avatar} alt={data.user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {data.user.name}
                    </span>
                    <span className="truncate text-xs">{data.user.email}</span>
                  </div>
                  <IconPlaceholder
                    lucide="ChevronsUpDownIcon"
                    tabler="IconSelector"
                    hugeicons="UnfoldMoreIcon"
                    phosphor="CaretUpDownIcon"
                    remixicon="RiArrowUpDownLine"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <Item size="xs">
                        <ItemMedia>
                          <Avatar>
                            <AvatarImage
                              src={data.user.avatar}
                              alt={data.user.name}
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{data.user.name}</ItemTitle>
                          <ItemDescription> {data.user.email}</ItemDescription>
                        </ItemContent>
                      </Item>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Account</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Log out</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
