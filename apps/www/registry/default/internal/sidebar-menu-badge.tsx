"use client"

import { Frame, LifeBuoy, Map, PieChart, Send } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/registry/default/ui/sidebar"

const projects = [
  {
    name: "Design Engineering",
    url: "#",
    icon: Frame,
    badge: "24",
  },
  {
    name: "Sales & Marketing",
    url: "#",
    icon: PieChart,
    badge: "12",
  },
  {
    name: "Travel",
    url: "#",
    icon: Map,
    badge: "3",
  },
  {
    name: "Support",
    url: "#",
    icon: LifeBuoy,
    badge: "21",
  },
  {
    name: "Feedback",
    url: "#",
    icon: Send,
    badge: "8",
  },
]

export default function AppSidebar() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton
                      asChild
                      className="group-has-[[data-state=open]]/menu-item:bg-sidebar-accent"
                    >
                      <a href={project.url}>
                        <project.icon />
                        <span>{project.name}</span>
                      </a>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{project.badge}</SidebarMenuBadge>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
