import React from "react"

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/default/ui/sidebar"

export function AppSidebarHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <a href="#" className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg border bg-background">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <path
                        d="M7.81815 8.36373L12 0L24 24H15.2809L7.81815 8.36373Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M4.32142 15.3572L8.44635 24H-1.14809e-06L4.32142 15.3572Z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">v4.0.0</p>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}
