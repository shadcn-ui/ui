"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import { Drawer as DrawerPrimitive } from "@ark-ui/react/drawer"
import { Portal } from "@ark-ui/react/portal"

import { cn } from "@/registry/bases/ark/lib/utils"

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
      className={cn("cn-drawer-overlay fixed inset-0 z-50", className)}
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
            "cn-drawer-content group/drawer-content z-50 w-full outline-none",
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
      className={cn("cn-drawer-handle-wrapper", className)}
      {...props}
    >
      <DrawerPrimitive.GrabberIndicator className="cn-drawer-handle mx-auto shrink-0" />
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
      className={cn("cn-drawer-header flex flex-col", className)}
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
      className={cn("cn-drawer-footer mt-auto flex flex-col", className)}
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
      className={cn("cn-drawer-title", className)}
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
      className={cn("cn-drawer-description", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHandle,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
