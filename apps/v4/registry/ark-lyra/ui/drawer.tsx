"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import {
  Drawer as DrawerPrimitive,
  useDrawer,
  useDrawerContext,
  type DrawerOpenChangeDetails,
} from "@ark-ui/react/drawer"
import { Portal } from "@ark-ui/react/portal"

import { cn } from "@/registry/ark-lyra/lib/utils"

function Drawer({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.CloseTrigger>) {
  return <DrawerPrimitive.CloseTrigger data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Backdrop>) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn("data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/10 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 z-50", className)}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  showHandle = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content> & {
  showHandle?: boolean
}) {
  return (
    <Portal>
      <DrawerOverlay />
      <DrawerPrimitive.Positioner className="fixed inset-0 z-50">
        <DrawerPrimitive.Content
          data-slot="drawer-content"
          className={cn(
            "bg-background flex h-auto flex-col text-xs/relaxed data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-none data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:rounded-none data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:rounded-none data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-none data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm data-[swipe-direction=down]:inset-x-0 data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:mt-24 data-[swipe-direction=down]:max-h-[80vh] data-[swipe-direction=down]:rounded-none data-[swipe-direction=down]:border-t data-[swipe-direction=left]:inset-y-0 data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:w-3/4 data-[swipe-direction=left]:rounded-none data-[swipe-direction=left]:border-r data-[swipe-direction=right]:inset-y-0 data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:w-3/4 data-[swipe-direction=right]:rounded-none data-[swipe-direction=right]:border-l data-[swipe-direction=up]:inset-x-0 data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:mb-24 data-[swipe-direction=up]:max-h-[80vh] data-[swipe-direction=up]:rounded-none data-[swipe-direction=up]:border-b data-[swipe-direction=left]:sm:max-w-sm data-[swipe-direction=right]:sm:max-w-sm group/drawer-content z-50 w-full outline-none",
            className
          )}
          {...props}
        >
          {showHandle && <DrawerHandle />}
          {children}
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Positioner>
    </Portal>
  )
}

function DrawerHandle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Grabber>) {
  return (
    <DrawerPrimitive.Grabber
      data-slot="drawer-handle"
      className={cn(className)}
      {...props}
    >
      <DrawerPrimitive.GrabberIndicator className="bg-muted mt-4 hidden h-1 w-[100px] rounded-none group-data-[vaul-drawer-direction=bottom]/drawer-content:block group-data-[swipe-direction=down]/drawer-content:block mx-auto shrink-0" />
    </DrawerPrimitive.Grabber>
  )
}

function DrawerHeader({
  className,
  ...props
}: React.ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      data-slot="drawer-header"
      className={cn("gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center group-data-[swipe-direction=down]/drawer-content:text-center group-data-[swipe-direction=up]/drawer-content:text-center md:gap-0.5 md:text-left flex flex-col", className)}
      {...props}
    />
  )
}

function DrawerFooter({
  className,
  ...props
}: React.ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      data-slot="drawer-footer"
      className={cn("gap-2 p-4 mt-auto flex flex-col", className)}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-foreground text-sm font-medium", className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof ark.p>) {
  return (
    <ark.p
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-xs/relaxed", className)}
      {...props}
    />
  )
}

const DrawerContext = DrawerPrimitive.Context
const DrawerRootProvider = DrawerPrimitive.RootProvider

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerContext,
  DrawerDescription,
  DrawerFooter,
  DrawerHandle,
  DrawerHeader,
  DrawerOverlay,
  DrawerRootProvider,
  DrawerTitle,
  DrawerTrigger,
  useDrawer,
  useDrawerContext,
  type DrawerOpenChangeDetails,
}
