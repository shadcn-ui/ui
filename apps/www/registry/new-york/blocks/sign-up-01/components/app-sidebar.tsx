"use client"

import { useState } from "react"

import { SignUpForm } from "@/registry/new-york/blocks/sign-up-01/components/sign-up-form"
import { Terms } from "@/registry/new-york/blocks/sign-up-01/components/terms"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarProvider,
} from "@/registry/new-york/ui/sidebar"

export function AppSidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <SidebarProvider open={isOpen}>
      <Sidebar
        wrapped
        variant="inset"
        collapsible="offcanvas"
        side="right"
        className="w-[380px] !h-[480px] p-0"
      >
        <SidebarContent>
          <SidebarGroup className="p-0 rounded-lg">
            <SidebarGroupContent>
              <Terms onCloseClick={() => setIsOpen(false)} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="ml-2 justify-center !ml-[8px]">
        <SignUpForm onTermsClick={() => setIsOpen(true)} />
      </SidebarInset>
    </SidebarProvider>
  )
}
