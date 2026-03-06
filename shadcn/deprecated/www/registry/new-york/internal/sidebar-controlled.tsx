"use client"

import * as React from "react"
import {
  Frame,
  LifeBuoy,
  Map,
  PanelLeftClose,
  PanelLeftOpen,
  PieChart,
  Send,
} from "lucide-react"

import { Button } from "@/registry/new-york/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/registry/new-york/ui/sidebar"

const projects = [
  {
    name: "Design Engineering",
    url: "#",
    icon: Frame,
  },
  {
    name: "Sales & Marketing",
    url: "#",
    icon: PieChart,
  },
  {
    name: "Travel",
    url: "#",
    icon: Map,
  },
  {
    name: "Support",
    url: "#",
    icon: LifeBuoy,
  },
  {
    name: "Feedback",
    url: "#",
    icon: Send,
  },
]

export default function AppSidebar() {
  const [open, setOpen] = React.useState(true)

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton asChild>
                      <a href={project.url}>
                        <project.icon />
                        <span>{project.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center h-12 px-4 justify-between">
          <Button
            onClick={() => setOpen((open) => !open)}
            size="sm"
            variant="ghost"
          >
            {open ? <PanelLeftClose /> : <PanelLeftOpen />}
            <span>{open ? "Close" : "Open"} Sidebar</span>
          </Button>
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}
