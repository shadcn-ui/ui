"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"

import { cn } from "@/registry/bases/base/lib/utils"

function Drawer({ ...props }: DrawerPrimitive.Root.Props) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
  className,
  ...props
}: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        "cn-drawer-overlay fixed inset-0 z-50 opacity-[calc(1-var(--drawer-swipe-progress))] transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0",
        className
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  ...props
}: DrawerPrimitive.Popup.Props) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Viewport
        data-slot="drawer-viewport"
        className="pointer-events-none fixed inset-0 z-50"
      >
        <DrawerPrimitive.Popup
          data-slot="drawer-content"
          className={cn(
            "cn-drawer-content group/drawer-content pointer-events-auto fixed z-50 transform-(--drawer-transform) overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform [--drawer-bleed-x:3rem] [--drawer-bleed-y:3rem] data-ending-style:transform-(--drawer-closed-transform) data-starting-style:transform-(--drawer-closed-transform) data-swiping:duration-0 data-swiping:select-none data-[swipe-direction=down]:inset-x-0 data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:mt-24 data-[swipe-direction=down]:-mb-(--drawer-bleed-y) data-[swipe-direction=down]:max-h-[calc(80vh+var(--drawer-bleed-y))] data-[swipe-direction=down]:pb-(--drawer-bleed-y) data-[swipe-direction=down]:[--drawer-closed-transform:translate3d(0,100%,0)] data-[swipe-direction=down]:[--drawer-transform:translate3d(0,var(--drawer-swipe-movement-y),0)] data-[swipe-direction=left]:inset-y-0 data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:-ml-(--drawer-bleed-x) data-[swipe-direction=left]:w-[calc(75%+var(--drawer-bleed-x))] data-[swipe-direction=left]:pl-(--drawer-bleed-x) data-[swipe-direction=left]:[--drawer-closed-transform:translate3d(-100%,0,0)] data-[swipe-direction=left]:[--drawer-transform:translate3d(var(--drawer-swipe-movement-x),0,0)] data-[swipe-direction=right]:inset-y-0 data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:-mr-(--drawer-bleed-x) data-[swipe-direction=right]:w-[calc(75%+var(--drawer-bleed-x))] data-[swipe-direction=right]:pr-(--drawer-bleed-x) data-[swipe-direction=right]:[--drawer-closed-transform:translate3d(100%,0,0)] data-[swipe-direction=right]:[--drawer-transform:translate3d(var(--drawer-swipe-movement-x),0,0)] data-[swipe-direction=up]:inset-x-0 data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:-mt-(--drawer-bleed-y) data-[swipe-direction=up]:mb-24 data-[swipe-direction=up]:max-h-[calc(80vh+var(--drawer-bleed-y))] data-[swipe-direction=up]:pt-(--drawer-bleed-y) data-[swipe-direction=up]:[--drawer-closed-transform:translate3d(0,-100%,0)] data-[swipe-direction=up]:[--drawer-transform:translate3d(0,var(--drawer-swipe-movement-y),0)] data-[swipe-direction=left]:sm:w-[calc(24rem+var(--drawer-bleed-x))] data-[swipe-direction=right]:sm:w-[calc(24rem+var(--drawer-bleed-x))]",
            className
          )}
          {...props}
        >
          <div className="cn-drawer-handle mx-auto hidden shrink-0 group-data-[swipe-direction=down]/drawer-content:block" />
          <DrawerPrimitive.Content className="flex min-h-0 flex-1 flex-col">
            {children}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "cn-drawer-header flex flex-col group-data-[swipe-direction=down]/drawer-content:text-center group-data-[swipe-direction=up]/drawer-content:text-center",
        className
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("cn-drawer-footer mt-auto flex flex-col", className)}
      {...props}
    />
  )
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("cn-drawer-title cn-font-heading", className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("cn-drawer-description", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
