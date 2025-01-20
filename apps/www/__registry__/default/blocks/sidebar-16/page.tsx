"use client"

import * as React from "react"
import { Settings, Sidebar } from "lucide-react"

import { AppSidebar } from "@/registry/default/blocks/sidebar-16/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/default/ui/breadcrumb"
import { Button } from "@/registry/default/ui/button"
import { Separator } from "@/registry/default/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/default/ui/sidebar"

export const iframeHeight = "800px"

export const description = "An inset sidebar with site header navigation."

const HEADER_HEIGHT = "4rem"

export default function Page() {
  const [open, setOpen] = React.useState(true)

  return (
    <div
      style={
        {
          "--header-height": HEADER_HEIGHT,
        } as React.CSSProperties
      }
    >
      <header className="bg-sidebar/75 sticky h-[--header-height] top-0 z-50 w-full border-b border-border/40 backdrop-blur flex items-center">
        <div className="flex gap-2 items-center px-4 w-full">
          <Button
            className="hidden md:flex"
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
          >
            <Sidebar />
          </Button>
          <nav className="flex items-center gap-4 text-sm xl:gap-6">
            <a href="#" className="transition-colors hover:text-foreground/80">
              Home
            </a>
            <a href="#" className="transition-colors hover:text-foreground/80">
              About
            </a>
          </nav>
          <Button
            className="ml-auto"
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
          >
            <Settings />
          </Button>
        </div>
      </header>
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <AppSidebar />

        <SidebarInset>
          <header className=" flex shrink-0 items-center gap-2 border-b py-2">
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="flex md:hidden items-center gap-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
              </div>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
