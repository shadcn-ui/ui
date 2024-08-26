"use client"

import * as React from "react"
import { PanelLeft } from "lucide-react"

import { cn } from "@/registry/new-york/lib/utils"
import { Button } from "@/registry/new-york/ui/button"
import { Sheet, SheetContent } from "@/registry/new-york/ui/sheet"

function useSidebar() {
  const [state, setState] = React.useState<"closed" | "open">("open")

  return {
    open: state === "open",
    onOpenChange: (open: boolean) => setState(open ? "open" : "closed"),
  }
}

const SidebarLayout = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>((props, ref) => {
  const { open } = useSidebar()

  return (
    <div
      ref={ref}
      data-sidebar={open}
      style={
        {
          "--sidebar-width": "16rem",
        } as React.CSSProperties
      }
      className="flex min-h-screen bg-accent/50 pl-0 transition-all duration-300 ease-in-out data-[sidebar=closed]:pl-0 sm:pl-[--sidebar-width]"
      {...props}
    />
  )
})
SidebarLayout.displayName = "SidebarLayout"

const Sidebar = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, children }, ref) => {
    const { onOpenChange } = useSidebar()

    const sidebar = (
      <div
        ref={ref}
        className={cn("flex h-full flex-col border-r bg-background", className)}
      >
        {children}
      </div>
    )

    return (
      <>
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-[--sidebar-width] transition-all duration-300 ease-in-out md:block [[data-sidebar=closed]_&]:left-[calc(var(--sidebar-width)*-1)]">
          {sidebar}
        </aside>
        <Sheet onOpenChange={onOpenChange}>
          <SheetContent className="p-0" side="left">
            {sidebar}
          </SheetContent>
        </Sheet>
      </>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { onOpenChange } = useSidebar()

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="sm"
      className={cn("flex h-8 w-8 md:hidden", className)}
      onClick={() => onOpenChange(!open)}
      {...props}
    >
      <PanelLeft className="absolute h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

export { Sidebar, SidebarLayout, SidebarTrigger, useSidebar }
