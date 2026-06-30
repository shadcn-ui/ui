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
        className="fixed inset-0 z-50"
      >
        <DrawerPrimitive.Popup
          data-slot="drawer-content"
          className={cn(
            // Base.
            "cn-drawer-content-base group/drawer-content pointer-events-auto fixed z-50 transform-(--drawer-transform) overflow-hidden transition-[transform,height,opacity] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform",
            // Stack.
            "[--drawer-bleed-x:3rem] [--drawer-bleed-y:3rem] [--drawer-stack-offset:calc(var(--drawer-stack-peek-offset)+(var(--drawer-stack-shrink)*var(--drawer-stack-size)))] [--drawer-stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--drawer-stack-progress))*1rem))] [--drawer-stack-progress:clamp(0,var(--drawer-swipe-progress),1)] [--drawer-stack-scale-base:calc(max(0,1-(var(--nested-drawers)*var(--drawer-stack-step))))] [--drawer-stack-scale:clamp(0,calc(var(--drawer-stack-scale-base)+(var(--drawer-stack-step)*var(--drawer-stack-progress))),1)] [--drawer-stack-shrink:calc(1-var(--drawer-stack-scale))] [--drawer-stack-size:max(0px,calc(var(--drawer-frontmost-height,var(--drawer-height,0px))-var(--drawer-bleed-y)))] [--drawer-stack-step:0.05] [--drawer-transform:translate3d(var(--drawer-translate-x),var(--drawer-translate-y),0)_scale(var(--drawer-stack-scale))] [--drawer-translate-x:0px] [--drawer-translate-y:0px]",
            // Nested state.
            "after:pointer-events-none after:absolute after:inset-0 after:bg-transparent after:transition-[background-color] after:duration-500 after:ease-[cubic-bezier(0.32,0.72,0,1)] after:content-[''] data-nested-drawer-open:overflow-hidden data-nested-drawer-open:after:bg-black/5 data-nested-drawer-swiping:duration-0",
            // Transitions.
            "data-ending-style:transform-(--drawer-closed-transform) data-ending-style:opacity-[0.9999] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*500ms)] data-ending-style:data-nested-drawer-swiping:duration-[calc(var(--drawer-swipe-strength)*500ms)] data-starting-style:transform-(--drawer-closed-transform) data-swiping:duration-0 data-swiping:select-none data-ending-style:data-swiping:duration-[calc(var(--drawer-swipe-strength)*500ms)]",
            // Direction: down.
            "data-[swipe-direction=down]:inset-x-0 data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:mt-24 data-[swipe-direction=down]:-mb-(--drawer-bleed-y) data-[swipe-direction=down]:max-h-[calc(80vh+var(--drawer-bleed-y))] data-[swipe-direction=down]:origin-[50%_calc(100%-var(--drawer-bleed-y))] data-[swipe-direction=down]:pb-(--drawer-bleed-y) data-[swipe-direction=down]:[--drawer-closed-transform:translate3d(0,100%,0)] data-[swipe-direction=down]:[--drawer-translate-y:calc(var(--drawer-swipe-movement-y)-var(--drawer-stack-offset))] data-[swipe-direction=down]:data-nested-drawer-open:h-[calc(var(--drawer-stack-size)+var(--drawer-bleed-y))]",
            // Direction: up.
            "data-[swipe-direction=up]:inset-x-0 data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:-mt-(--drawer-bleed-y) data-[swipe-direction=up]:mb-24 data-[swipe-direction=up]:max-h-[calc(80vh+var(--drawer-bleed-y))] data-[swipe-direction=up]:origin-[50%_var(--drawer-bleed-y)] data-[swipe-direction=up]:pt-(--drawer-bleed-y) data-[swipe-direction=up]:[--drawer-closed-transform:translate3d(0,-100%,0)] data-[swipe-direction=up]:[--drawer-translate-y:calc(var(--drawer-swipe-movement-y)+var(--drawer-stack-offset))] data-[swipe-direction=up]:data-nested-drawer-open:h-[calc(var(--drawer-stack-size)+var(--drawer-bleed-y))]",
            // Direction: left.
            "data-[swipe-direction=left]:inset-y-0 data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:-ml-(--drawer-bleed-x) data-[swipe-direction=left]:w-[calc(75%+var(--drawer-bleed-x))] data-[swipe-direction=left]:origin-[var(--drawer-bleed-x)_50%] data-[swipe-direction=left]:pl-(--drawer-bleed-x) data-[swipe-direction=left]:[--drawer-closed-transform:translate3d(-100%,0,0)] data-[swipe-direction=left]:[--drawer-stack-size:max(0px,calc(100%-var(--drawer-bleed-x)))] data-[swipe-direction=left]:[--drawer-translate-x:calc(var(--drawer-swipe-movement-x)+var(--drawer-stack-offset))] data-[swipe-direction=left]:sm:w-[calc(24rem+var(--drawer-bleed-x))]",
            // Direction: right.
            "data-[swipe-direction=right]:inset-y-0 data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:-mr-(--drawer-bleed-x) data-[swipe-direction=right]:w-[calc(75%+var(--drawer-bleed-x))] data-[swipe-direction=right]:origin-[calc(100%-var(--drawer-bleed-x))_50%] data-[swipe-direction=right]:pr-(--drawer-bleed-x) data-[swipe-direction=right]:[--drawer-closed-transform:translate3d(100%,0,0)] data-[swipe-direction=right]:[--drawer-stack-size:max(0px,calc(100%-var(--drawer-bleed-x)))] data-[swipe-direction=right]:[--drawer-translate-x:calc(var(--drawer-swipe-movement-x)-var(--drawer-stack-offset))] data-[swipe-direction=right]:sm:w-[calc(24rem+var(--drawer-bleed-x))]",
            className
          )}
          {...props}
        >
          <div
            className={cn(
              "cn-drawer-handle-base relative mx-auto hidden shrink-0 transition-opacity duration-200 group-data-nested-drawer-open/drawer-content:opacity-0 group-data-nested-drawer-swiping/drawer-content:opacity-100 group-data-[swipe-direction=down]/drawer-content:block group-data-[swipe-direction=up]/drawer-content:order-last group-data-[swipe-direction=up]/drawer-content:block after:absolute after:-inset-4"
            )}
          />
          <DrawerPrimitive.Content
            className={cn(
              "flex min-h-0 flex-1 flex-col transition-opacity duration-300 ease-[cubic-bezier(0.45,1.005,0,1.005)]",
              "group-data-nested-drawer-open/drawer-content:opacity-0 group-data-nested-drawer-swiping/drawer-content:opacity-100"
            )}
          >
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
