"use client"

import * as React from "react"
import { Command, Sidebar } from "lucide-react"

import { AppSidebar } from "@/registry/default/block/sidebar-16/components/app-sidebar"
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

import { NavigationHeaderMenu } from "./components/nav-header-menu"

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
      <header className="sticky top-0 bg-sidebar flex h-[--header-height] shrink-0 items-center gap-2 border-b px-4 isolate z-20">
        <div className="flex items-center gap-2 w-full">
          <Button
            className="hidden md:flex"
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
          >
            <Sidebar />
          </Button>

          <div className="mx-auto flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Command className="size-4" />
            </div>
            <Separator orientation="vertical" className="ml-4 h-4" />
            <NavigationHeaderMenu />
          </div>
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
