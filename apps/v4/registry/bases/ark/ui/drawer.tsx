"use client"

import * as React from "react"
import {
  Drawer as DrawerPrimitive,
  useDrawer,
  useDrawerContext,
  type DrawerOpenChangeDetails,
} from "@ark-ui/react/drawer"
import { ark } from "@ark-ui/react/factory"
import { Portal } from "@ark-ui/react/portal"

import { cn } from "@/registry/bases/ark/lib/utils"

function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
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
      className={cn(
        "cn-drawer-overlay fixed inset-0 z-50",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        className
      )}
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
      <DrawerPrimitive.Positioner
        className={cn(
          "fixed inset-0 z-50 flex items-stretch overscroll-y-none",
          "data-[swipe-direction=down]:flex-col data-[swipe-direction=down]:justify-end",
          "data-[swipe-direction=up]:flex-col data-[swipe-direction=up]:justify-start",
          "data-[swipe-direction=left]:flex-row data-[swipe-direction=left]:justify-start",
          "data-[swipe-direction=right]:flex-row data-[swipe-direction=right]:justify-end"
        )}
      >
        <DrawerPrimitive.Content
          data-slot="drawer-content"
          className={cn(
            "cn-drawer-content group/drawer-content relative z-50 flex max-h-[100dvh] flex-col outline-none",
            "data-[swipe-direction=down]:max-h-[80vh] data-[swipe-direction=up]:max-h-[80vh]",
            "data-[swipe-direction=left]:w-3/4 data-[swipe-direction=right]:w-3/4 data-[swipe-direction=left]:sm:max-w-sm data-[swipe-direction=right]:sm:max-w-sm",
            "data-[state=closed]:animate-out data-[state=open]:animate-in",
            "data-[state=closed]:data-[swipe-direction=down]:slide-out-to-bottom data-[state=open]:data-[swipe-direction=down]:slide-in-from-bottom",
            "data-[state=closed]:data-[swipe-direction=up]:slide-out-to-top data-[state=open]:data-[swipe-direction=up]:slide-in-from-top",
            "data-[state=closed]:data-[swipe-direction=left]:slide-out-to-left data-[state=open]:data-[swipe-direction=left]:slide-in-from-left",
            "data-[state=closed]:data-[swipe-direction=right]:slide-out-to-right data-[state=open]:data-[swipe-direction=right]:slide-in-from-right",
            "data-[swiping]:animate-none",
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
      className={cn(
        "cn-drawer-handle-wrapper flex shrink-0 items-center justify-center",
        "group-data-[swipe-direction=left]/drawer-content:absolute group-data-[swipe-direction=left]/drawer-content:inset-y-0 group-data-[swipe-direction=left]/drawer-content:right-0 group-data-[swipe-direction=left]/drawer-content:px-2",
        "group-data-[swipe-direction=right]/drawer-content:absolute group-data-[swipe-direction=right]/drawer-content:inset-y-0 group-data-[swipe-direction=right]/drawer-content:left-0 group-data-[swipe-direction=right]/drawer-content:px-2",
        className
      )}
      {...props}
    >
      <DrawerPrimitive.GrabberIndicator
        className={cn(
          "cn-drawer-handle mx-auto shrink-0",
          "group-data-[swipe-direction=down]/drawer-content:block group-data-[swipe-direction=up]/drawer-content:block",
          "group-data-[swipe-direction=left]/drawer-content:mt-0 group-data-[swipe-direction=left]/drawer-content:block group-data-[swipe-direction=left]/drawer-content:rotate-90",
          "group-data-[swipe-direction=right]/drawer-content:mt-0 group-data-[swipe-direction=right]/drawer-content:block group-data-[swipe-direction=right]/drawer-content:rotate-90"
        )}
      />
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
      className={cn("cn-drawer-header flex shrink-0 flex-col", className)}
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
      className={cn(
        "cn-drawer-footer mt-auto flex shrink-0 flex-col",
        className
      )}
      {...props}
    />
  )
}

function DrawerBody({
  className,
  ...props
}: React.ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      data-slot="drawer-body"
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain",
        className
      )}
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

const DrawerContext = DrawerPrimitive.Context
const DrawerRootProvider = DrawerPrimitive.RootProvider

export {
  Drawer,
  DrawerBody,
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
